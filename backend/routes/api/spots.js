const express = require('express')
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, Image, Review } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, handleValidationErrorsUsers, handleValidationErrorsSpots } = require('../../utils/validation');
const Sequelize = require('sequelize');

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

router.get('/:spotId/reviews', async (req, res)=>{

    let {spotId} = req.params 
    spotId = Number(spotId)

    const spot = await Spot.findOne({ where: { id: spotId } });
    

    console.log("\n\n\n", spot, "\n\n\n")


    if(!spot){
        res.status(404).json({message:  "Spot couldn't be found"})
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

        let images = await Image.findOne({
            where: {imageableType: 'Review'}
        })


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
                    id: images.id,
                    url: images.url,
                },
            ],
        }


        formattedReviews.push(formattedReview)
        
    }
    
    res.status(200).json({Reviews: formattedReviews})

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
            url: newImage.url,
            preview: newImage.preview
        }


        res.status(200).json(safeResponse)
    } else {
        res.status(403).json({ message: "Forbidden" })
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
            price: spot.price,
            createdAt: createddate,
            updatedAt: updateddate,
        };

        res.status(200).json(responseEdit)

    } else {
        return res.status(404).json({ message: "Spot couldn't be found" });

    }

})

router.get('/current', requireAuth, async (req, res) => {

    let currentUser = req.user

    let getAllSpots = await Spot.findAll({

        where: { ownerId: currentUser.id },

    })

    const formattedSpots = [];

    for (const spot of getAllSpots) {

        const reviews = await Review.findAll({
            where: { spotId: spot.id },
            attributes: ['stars'],


        });

        const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);
        const avgRating = reviews.length > 0 ? totalStars / reviews.length : 0;

        let createdAtDate = new Date(spot.createdAt);
        let upadatedAtDate = new Date(spot.updatedAt)

        createdAtDate = createdAtDate.toISOString().replace('T', ' ').split('.')[0];
        upadatedAtDate = upadatedAtDate.toISOString().replace('T', ' ').split('.')[0];

        const spotImages = await Image.findAll({
            attributes: ['id', 'url'],
            where: { imageableType: 'Spot', imageableId: spot.id },
        });


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
            previewImage: spotImages.length > 0 ? spotImages[0].url : null,
        };

        formattedSpots.push(formattedSpot);
    }

    const response = {
        Spots: formattedSpots,
    };


    res.status(200).json(response);

})


router.get('/:id', async (req, res) => {

    let { id } = req.params
    let spotId = Number(id)

    //load spot 
    let spot = await Spot.findByPk(spotId)

    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    //Load Spot Images 
    let images = await Image.findAll({
        where: {imageableType: 'Spot'},
        attributes:  ['id', 'url', 'preview']
    })

    let spotImages = images.map((image) => ({
        id: image.id,
        url: image.url,
        preview: image.preview,
    }));
    


//   console.log("\n\n\n", spotImages , "\n\n\n")

    // console.log(spotImages)


    //load Owner details 
    let owner = await User.findByPk(spot.ownerId, {
        attributes: ['id', 'firstName', 'lastName'],
    })


    //load reviews 
    let reviews = await Review.findAll({
        where: {spotId: spot.id},
        attributes: ['stars']
        // attributes: [[Sequelize.fn('avg', Sequelize.col('stars')), 'avgStarRating']]
    })


    let totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);

    let avgRating = reviews.length > 0 ? totalStars / reviews.length : 0;


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
        SpotImages: spotImages,
        Owner: owner,
      };


      res.status(200).json(formattedResponse)

})

router.delete('/:spotId', requireAuth, async (req, res) => {
    let currUser = req.user
    let { spotId } = req.params

    let spot = await Spot.findOne({ where: { id: spotId } })

    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (currUser.id === spot.ownerId) {

        await spot.destroy()

        res.status(200).json({ message: "Successfully deleted" })

    } else {
        res.status(403).json({ message: "Forbidden" })
    }

})



router.get('/', async (req, res) => {


    const getAllSpots = await Spot.findAll();

    const formattedSpots = [];

    for (const spot of getAllSpots) {

        const reviews = await Review.findAll({
            where: { spotId: spot.id },
            attributes: ['stars'],


        });

        const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);
        const avgRating = reviews.length > 0 ? totalStars / reviews.length : 0;

        let createdAtDate = new Date(spot.createdAt);
        let upadatedAtDate = new Date(spot.updatedAt)

        createdAtDate = createdAtDate.toISOString().replace('T', ' ').split('.')[0];
        upadatedAtDate = upadatedAtDate.toISOString().replace('T', ' ').split('.')[0];

        let images = await Image.findAll({
            where: { imageableType: 'Spot'},
        });

        let spotImages = images.map((image) => ({
            id: image.id,
            url: image.url,
            preview: image.preview,
        }));
        
       

    //   console.log("\n\n\n", images , "\n\n\n")


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
            previewImage: spotImages[0].url,
        };

        formattedSpots.push(formattedSpot);
    }

    const response = {
        Spots: formattedSpots,
    };


    res.status(200).json(response);


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
            price: newSpot.price

        }

        res.status(201).json(safeSpot)
    } else {
        res.status(403).json({ message: "Forbidden" })
    }


})




module.exports = router;
