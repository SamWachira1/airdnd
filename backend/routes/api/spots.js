const express = require('express')
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, Image, Review, Booking } = require('../../db/models');
const { check, query } = require('express-validator');
const { handleValidationErrors, handleValidationErrorsSpots, checkBookingConflicts } = require('../../utils/validation');
const {Sequelize, Op} = require('sequelize');


const router = express.Router();

const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Street address is required"),
    check('city')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("City is required"),
    check('state')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("State is required"),
    check('country')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Country is required"),
    check('lat')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isFloat({ min: -90, max: 90 })
        .withMessage("Latitude must be within -90 and 90"),

    check('lng')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isFloat({ min: -180, max: 180 })
        .withMessage("Longitude must be within -180 and 180"),

    check('name')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isLength({ max: 50 })
        .withMessage("Name must be less than 50 characters"),

    check('description')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Description is required"),

    check('price')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isFloat({ gt: 0 })
        .withMessage("Price per day must be a positive number"),

    handleValidationErrorsSpots

];

const validateReview = [
    check('review')
      .notEmpty()
      .withMessage('Review text is required'),
    check('stars')
      .isFloat({ min: 1.0, max: 5.0 })
      .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors,
  ];

  const validateBooking = [
    check('startDate')
    .notEmpty()
    .custom((value, ) => {
        if (new Date(value) < new Date()) {
          throw new Error('startDate cannot be in the past');
        }
        return true;
      }),
    check('endDate')
      .notEmpty()
      .custom((value, { req }) => {
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(value);
  
        if (endDate <= startDate) {
          throw new Error('endDate cannot be on or before startDate');
        }
        return true;
      }),

      handleValidationErrors,
      checkBookingConflicts

  ]

  const setDefaultValues = (req, res, next) => {
    if (!req.query.page) {
      req.query.page = 1; 
    }
  
    if (!req.query.size) {
      req.query.size = 20; 
    }
  
    next();
  };
  


  const validateQueryParams = [
    setDefaultValues,

    query('page')
        .optional()
        .isInt({ min: 1, max: 10 })
        .withMessage('Page must be an integer between 1 and 10'),

    query('size')
        .optional()
        .isInt({ min: 1, max: 20 })
        .withMessage('Size must be an integer between 1 and 20'),

    query('minLat')
        .if((value) => value !== '')
        .isFloat({min: -90, max: 90})
        .optional()
        .isDecimal()
        .withMessage('Minimum latitude is invalid'),

    query('maxLat')
        .if((value) => value !== '')

        .isFloat({min: -90, max: 90})
        .optional()
        .isDecimal()
        .withMessage('Maximum latitude is invalid'),

    query('minLng')
        .if((value) => value !== '')

        .isFloat({min: -180, max: 180})
        .optional()
        .isDecimal()
        .withMessage('Minimum longitude is invalid'),

    query('maxLng')
        .if((value) => value !== '')

        .isFloat({min: -180, max: 180})
        .optional()
        .isDecimal()
        .withMessage('Maximum longitude is invalid'),

    query('minPrice')
        .if((value) => value !== '')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Minimum price must be greater than or equal to 0'),

    query('maxPrice')
        .if((value) => value !== '')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Maximum price must be greater than or equal to 0'),

    handleValidationErrors,

];

 router.get('/:spotId/bookings', requireAuth, async (req, res)=>{
    let currUser = req.user 
    let {spotId} = req.params 
    
    let user = await User.findByPk(currUser.id)
    let spot = await Spot.findByPk(Number(spotId))

    if(!spot){
        return res.status(404).json({message: "Spot couldn't be found" })
    }
    let bookings = await Booking.findAll({
        where: {
            spotId: spotId
        }
    })


    // console.log("\n\n\n",bookings, "\n\n\n")
    for (let booking of bookings){
        
        if (user.id !== spot.ownerId){
            let bookingStartDate = booking.startDate.toISOString().split('T')[0];
            let bookingEndDate = booking.endDate.toISOString().split('T')[0];
    
            let formattedResponse = {
                spotId: booking.spotId,
                startDate: bookingStartDate,
                endDate: bookingEndDate
            }
    
            return res.status(200).json({Bookings: [formattedResponse]})
        }else if (user.id === spot.ownerId) {
    
            let createdAtDate = new Date(booking.createdAt);
            let updatedAtDate = new Date(booking.updatedAt)
            
            let createdAtD = createdAtDate.toISOString().replace('T', ' ').split('.')[0];
            let updatedAtD = updatedAtDate.toISOString().replace('T', ' ').split('.')[0];
            
            let bookingStartDate = booking.startDate.toISOString().split('T')[0];
            let bookingEndDate = booking.endDate.toISOString().split('T')[0];
    
            let formattedResponse = {
                User: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName
                },
                id: booking.id,
                spotId: booking.spotId,
                userId: booking.userId,
                startDate: bookingStartDate,
                endDate: bookingEndDate, 
                createdAt: createdAtD,
                updatedAt: updatedAtD
    
            }
    
            return res.status(200).json({Bookings: [formattedResponse]})
        }


    }



 })


router.get('/:spotId/reviews', async (req, res)=>{

    let {spotId} = req.params 
    spotId = Number(spotId)

    const spot = await Spot.findOne({ where: { id: spotId } });
    

    if(!spot){
        return res.status(404).json({message:  "Spot couldn't be found"})
    }

    let reviews = await Review.findAll({
        where: {spotId: spotId},

    })



    let formattedReviews = [];

    for (const review of reviews){

        let users = await User.findOne({
            where: {id: review.userId}
        })

        let createdAtDate = new Date(review.createdAt);
        let updatedAtDate = new Date(review.updatedAt)

        let createdAtD = createdAtDate.toISOString().replace('T', ' ').split('.')[0];
        let updatedAtD = updatedAtDate.toISOString().replace('T', ' ').split('.')[0];

        

        let images = await Image.findAll({
            where: {imageableType: 'Review', imageableId: review.id}
        })

        let imageId;
        let urlResponse;
        for (let image of images){
            imageId = image.id
            urlResponse = image.url
        }

        // console.log("\n\n\n", images , "\n\n\n")


        let formattedReview = {
            id: review.id,
            userId: review.userId,
            spotId: review.spotId,
            review: review.review,
            stars: review.stars,
            createdAt: createdAtD,
            updatedAt: updatedAtD,
            User: {
                id: users.id,
                firstName: users.firstName,
                lastName: users.lastName,
            },

            ReviewImages: [
                {
                    id: imageId,
                    url: urlResponse,
                },
            ],
        }


        formattedReviews.push(formattedReview)
        
    }
    
    return res.status(200).json({Reviews: formattedReviews})

})

router.post('/:spotId/bookings', requireAuth, validateBooking, async (req, res)=> {

    let currUser = req.user 
    let {spotId} = req.params 
    let {startDate, endDate} = req.body 

    let spot = await Spot.findByPk(spotId)

    if (!spot){
        return res.status(404).json({message: "Spot couldn't be found"})
    }


    if (spot.ownerId !== currUser.id ){

        let newBooking = await Booking.create({
            userId: currUser.id, 
            spotId: spot.id,
            startDate,
            endDate
        })

        let formatedStartDate = newBooking.startDate.toISOString().split('T')[0];
        let formatedEndDate = newBooking.endDate.toISOString().split('T')[0];


    let createdAtDate = new Date(newBooking.createdAt);
    let updatedAtDate = new Date(newBooking.updatedAt)

    let createdAtD = createdAtDate.toISOString().replace('T', ' ').split('.')[0];
    let updatedAtD = updatedAtDate.toISOString().replace('T', ' ').split('.')[0];


        let formattedReponse = {
            id: newBooking.id,
            userId: newBooking.userId, 
            spotId: newBooking.spotId,
            startDate: formatedStartDate,
            endDate: formatedEndDate,
            createdAt: createdAtD,
            updatedAt: updatedAtD
        }

        return res.status(200).json(formattedReponse)
    }else {
        return res.status(403).json({message: 'Forbidden'})
    }



})




router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res) => {


    let user = req.user 
    let {spotId} = req.params 

    let {review, stars} = req.body 

    let spot = await Spot.findOne({
        where: {id: spotId},

    })
 
    if (!spot) {
        return res.status(404).json({message:  "Spot couldn't be found"})
    }

    let userReviewExisits = await Review.findOne({
        where: {spotId: spotId, userId: user.id}
    })
    
    // console.log("\n\n\n", reviewExists, "\n\n\n")

    if (userReviewExisits){
       return  res.status(500).json({message: "User already has a review for this spot" })
    }else {

        let newReview = await Review.create({
            review, 
            stars,
            userId: user.id,
            spotId: spot.id 
        })

        let createdAtDate = new Date(newReview.createdAt);
        let updatedAtDate = new Date(newReview.updatedAt)

        let createdAtD = createdAtDate.toISOString().replace('T', ' ').split('.')[0];
        let updatedAtD = updatedAtDate.toISOString().replace('T', ' ').split('.')[0];

        let safeResponse = {
            id: newReview.id,
            userId: newReview.userId,
            spotId: newReview.spotId,
            review: newReview.review,
            stars:  newReview.stars, 
            createdAt: createdAtD,
            updatedAt: updatedAtD

        }


        return res.status(201).json(safeResponse)
    }

   
})



router.post("/:spotId/images", requireAuth, async (req, res) => {

    const currUser = req.user;

    const { spotId } = req.params;
    const { url, preview } = req.body;


    const spot = await Spot.findOne({ where: { id: spotId } });

    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId === currUser.id) {
        const newImage = await Image.create({
            url,
            preview,
            imageableId: spot.id,
            imageableType: 'Spot',
        });


        const safeResponse = {
            id: newImage.id, 
            url: newImage.url,
            preview: newImage.preview
        }


        return res.status(200).json(safeResponse)
    } else {
       return  res.status(403).json({ message: "Forbidden" })
    }

});



router.put('/:spotId', requireAuth, validateSpot, async (req, res) => {

    const currUser = req.user;
    const { spotId } = req.params
    const { address, city, state, country, lat, lng, name, description, price } = req.body

    let spot = await Spot.findOne({ where: { id: spotId } })

    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId === parseInt(currUser.id)) {

        spot.address = address
        spot.city = city;
        spot.state = state;
        spot.country = country;
        spot.lat = lat;
        spot.lng = lng;
        spot.name = name;
        spot.description = description;
        spot.price = price;

        await spot.save()

        const createddate = new Date(spot.createdAt).toISOString().replace('T', ' ').split('.')[0];
        const updateddate = new Date(spot.updatedAt).toISOString().replace('T', ' ').split('.')[0];

        let priceFloat = parseFloat(spot.price.toFixed(1))


        const responseEdit = {
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: priceFloat,
            createdAt: createddate,
            updatedAt: updateddate,
        };

        return res.status(200).json(responseEdit)

    } else {
        return res.status(403).json({ message: "Forbidden" });

    }

})

router.get('/current', requireAuth, async (req, res) => {

    let currentUser = req.user

    let getAllSpots = await Spot.findAll({

        where: { ownerId: currentUser.id },

    })


    const formattedSpots = [];

    for (const spot of getAllSpots) {

        // console.log("\n\n\n", spot , "\n\n\n")


        const reviews = await Review.findAll({
            where: { spotId: spot.id },
            attributes: ['stars'],


        });

        let totalStars = 0  

        for (let review of reviews ){

             totalStars += review.stars
        }

        let avgRating = reviews.length > 0 ? parseFloat(totalStars / reviews.length.toFixed(1)) : null;



        let createdAtDate = new Date(spot.createdAt);
        let upadatedAtDate = new Date(spot.updatedAt)

        createdAtDate = createdAtDate.toISOString().replace('T', ' ').split('.')[0];
        upadatedAtDate = upadatedAtDate.toISOString().replace('T', ' ').split('.')[0];

        const spotImages = await Image.findAll({
            where: { imageableType: 'Spot', imageableId: spot.id },
        });


        let imageUrl;
         for (let i of spotImages){
            imageUrl = i.url
         }

        // console.log("\n\n\n", imageUrl , "\n\n\n")


         const formattedSpot = {
            id: spot.id,
            ownerId: spot.id,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createdAt: createdAtDate,
            updatedAt: upadatedAtDate,
            avgRating: avgRating,
            previewImage: spotImages.length > 0 ? imageUrl : null,
        };

        formattedSpots.push(formattedSpot);

 
    }


    return res.status(200).json({Spots: formattedSpots});

})


router.get('/:id', async (req, res) => {

    let { id } = req.params
    // let spotId = Number(id)

    //load spot 
    let spot = await Spot.findByPk(id)




    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    //Load Spot Images 
    let images = await Image.findAll({
        where: {imageableType: 'Spot', imageableId: spot.id},
        attributes:  ['id', 'url', 'preview']
    })

 
        let image;
        if (images.length < 1){
            image = [] 
        }else {
            images.forEach(i => {
                image = i 
            })
        }
    

        //load Owner details 
        let owner = await User.findByPk(spot.ownerId, {
            attributes: ['id', 'firstName', 'lastName'],
        })
    
    
        //load reviews 
        let reviews = await Review.findAll({
            where: {spotId: spot.id},
            attributes: ['stars']
        })



        let totalStars = 0;
        let avgRating;

        for (let review of reviews){
             
            totalStars += review.stars 
        
        }

        avgRating = reviews.length > 0 ? parseFloat((totalStars / reviews.length).toFixed(1)) : null;
        
  
        let createdAtDate = new Date(spot.createdAt);
        let upadatedAtDate = new Date(spot.updatedAt)
    
        createdAtDate = createdAtDate.toISOString().replace('T', ' ').split('.')[0];
        upadatedAtDate = upadatedAtDate.toISOString().replace('T', ' ').split('.')[0];
    
        let formattedResponse = {
            ...spot.toJSON(),
            createdAt: createdAtDate,
            updatedAt: upadatedAtDate,
            numReviews: reviews.length,
            avgStarRating: avgRating,
            SpotImages: image,
            Owner: owner,
          };


          return res.status(200).json(formattedResponse)
    
   
    


})

router.delete('/:spotId', requireAuth, async (req, res) => {
    let currUser = req.user
    let { spotId } = req.params

    let spot = await Spot.findByPk(spotId, {
        where: {
            ownerId: currUser.id 
        }
    })

    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (currUser.id === spot.ownerId) {

        await spot.destroy()

        return res.status(200).json({ message: "Successfully deleted" })

    } else {
       return  res.status(403).json({ message: "Forbidden" })
    }

})


router.get('/', validateQueryParams, async (req, res) => {


    let {page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query


    page = parseInt(page) 
    size = parseInt(size) 


    let limit;
    let offset;
    
    if (!isNaN(page) && !isNaN(size) && page > 0 && size > 0) {
        limit = size 
        offset = size * (page - 1)

    }


    const query = {

        where: {},
        limit,
        offset
    }

    if (minLat && maxLat) {
        query.where.lat = {
            [Op.between]: [parseFloat(minLat), parseFloat(maxLat)],
        };
    }
    
    if (minLng && maxLng) {
        query.where.lng = {
            [Op.between]: [parseFloat(minLng), parseFloat(maxLng)],
        };
    }

    if (minLat){
        query.where.lat = {
            [Op.gte]: parseFloat(minLat)
        }
    }

    if (maxLat){
        query.where.lat = {
            [Op.lte]: parseFloat(maxLat)
        }
    }

    if (minLng){
         query.where.lng = {
            [Op.gte]: parseFloat(minLng)
        }
    }

    if (maxLng){
         query.where.lng = {
            [Op.lte]: parseFloat(maxLng)
        }
    }

    if (minPrice){
        query.where.price = {
            [Op.gte]: parseFloat(minPrice)
        }
    }

    if (maxPrice){
        query.where.price = {
            [Op.lte]: parseFloat(maxPrice)
        }
    }


    if (minPrice && maxPrice) {
        query.where.price = {
            [Op.between]: [parseFloat(minPrice), parseFloat(maxPrice)],
        };
    }
    


    const getAllSpots = await Spot.findAll({
        ...query 
    });

    // console.log("\n\n\n",getAllSpots , "\n\n\n")


    const formattedSpots = [];

    for (const spot of getAllSpots) {

        const reviews = await Review.findAll({
            where: { spotId: spot.id },
            attributes: ['stars'],


        });

        let totalStars = 0 
        for (let review of reviews){
            totalStars += review.stars 
        }

        const avgRating = reviews.length > 0 ? totalStars / reviews.length : null;



        let createdAtDate = new Date(spot.createdAt);
        let upadatedAtDate = new Date(spot.updatedAt)

        createdAtDate = createdAtDate.toISOString().replace('T', ' ').split('.')[0];
        upadatedAtDate = upadatedAtDate.toISOString().replace('T', ' ').split('.')[0];

        let images = await Image.findAll({
            where: { imageableType: 'Spot', imageableId: spot.id},
        });
        
    
        let imgUrl;
        for (let i of images){
            imgUrl = i.url
        }



        const formattedSpot = {

            id: spot.id,
            ownerId: spot.id,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createdAt: createdAtDate,
            updatedAt: upadatedAtDate,
            avgRating: avgRating,
            previewImage: imgUrl,
        };

        // console.log("\n\n\n",formattedSpot, "\n\n\n")



        formattedSpots.push(formattedSpot)

    }


    return res.status(200).json({Spots: formattedSpots, page, size});



})





router.post('/', requireAuth, validateSpot, async (req, res) => {

    const currentUser = req.user; // Wait for user data

    let { address, city, state, country, lat, lng, name, description, price } = req.body

    if (currentUser) {

        let newSpot = await Spot.create({
            ownerId: currentUser.id,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,

        })

        let createdAtDate = new Date(newSpot.createdAt);
        let upadatedAtDate = new Date(newSpot.updatedAt)

        createdAtDate = createdAtDate.toISOString().replace('T', ' ').split('.')[0];
        upadatedAtDate = upadatedAtDate.toISOString().replace('T', ' ').split('.')[0];

        let priceFloat = parseFloat(newSpot.price.toFixed(1))

        const safeSpot = {
            id: newSpot.id,
            ownerId: newSpot.ownerId,
            address: newSpot.address,
            city: newSpot.city,
            state: newSpot.state,
            country: newSpot.country,
            lat: newSpot.lat,
            lng: newSpot.lng,
            name: newSpot.name,
            description: newSpot.description,
            price: priceFloat,
            createdAt: createdAtDate,
            updatedAt: upadatedAtDate


        }

        return res.status(201).json(safeSpot)
    } else {
       return  res.status(403).json({ message: "Forbidden" })
    }


})




module.exports = router;
