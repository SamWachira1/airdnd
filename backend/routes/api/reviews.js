const express = require('express')
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, Image, Review, SpotImages, ReviewImages } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, handleValidationErrorsUsers, handleValidationErrorsSpots } = require('../../utils/validation');

const router = express.Router();
//user /spot/ image
const validateReview = [
    check('review')
      .notEmpty()
      .withMessage('Review text is required'),
    check('stars')
      .isInt({ min: 1, max: 5 })
      .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
  ];

// GET REVIEWS OF CURRENT USER  /api/reviews/current
router.get('/current', requireAuth, async (req, res) => {
    let currUser = req.user

    let getAllReviews = await Review.findAll({
        where: { userId: currUser.id },
        // attributes: ['id', 'userId', 'spotId', 'review', 'stars']

    })

    const formattedReviews = []

    for (const review of getAllReviews) {

        const user = await User.findOne({
            where: { id: review.userId },

            attributes: ['id', 'firstName', 'lastName'],
        })

        let createdAtDate = new Date(review.createdAt);
        let upadatedAtDate = new Date(review.updatedAt)

        createdAtDate = createdAtDate.toISOString().replace('T', ' ').split('.')[0];
        upadatedAtDate = upadatedAtDate.toISOString().replace('T', ' ').split('.')[0];


        const spot = await Spot.findOne({
            where: { id: review.spotId },
            attributes: [
                'id',
                'ownerId',
                'address',
                'city',
                'state',
                'country',
                'lat',
                'lng',
                'name',
                'price',
            ],


        })

        const spotImage = await Image.findOne({
            where: { imageableType: 'Spot', imageableId: spot.id },
        })




        if (spotImage.preview !== true) {
            spotImage.url = 'No preview image'
        }

        let reviewImages = await Image.findAll({
            where: { imageableType: 'Review', imageableId: review.id }
        })


        // reviewImages = reviewImages.dataValues

        let reviewImageId; 
        let reviewImageUrl;
        
        for (let review of reviewImages){
            reviewImageId = review.id 
            reviewImageUrl = review.url 
        }



        let removePreview = {
            id: reviewImageId,
            url: reviewImageUrl
        }

        let priceFloat = parseFloat(spot.price.toFixed(1))


        const formattedReview = {
            ...review.toJSON(),
            createdAt: createdAtDate,
            updatedAt: upadatedAtDate,
            User: user,
            Spot: {
                id: spot.id,
                ownerId: spot.ownerId,
                address: spot.address,
                city: spot.city,
                state: spot.state,
                country: spot.country,
                lat: spot.lat,
                lng: spot.lng,
                name: spot.name,
                price: priceFloat,
                previewImage: spotImage.url
            },

            ReviewImages: removePreview,

        };

        formattedReviews.push(formattedReview);

    }


    return res.status(200).json({ Reviews: formattedReviews });


})

router.post('/:reviewId/images', requireAuth, async (req, res)=> {

    let userId = req.user.id

    let user = await User.findByPk(userId)


    let {reviewId} = req.params
    let {url} = req.body

    if (!url){
        return res.status(404).json({message: 'image is required '})
    }

    let review = await Review.findByPk(reviewId)



    if (!review){
        return res.status(404).json({ message: "Review couldn't be found"})
    }

    if (review.userId !== user.id){
       return  res.status(403).json({message: 'Forbidden'})
    }

    let findAllImages = await Image.findAll({
        where: {
            imageableType: 'Review',
            imageableId: review.id,
        }
    })

    if (findAllImages.length > 9){
        return  res.status(403).json({
            message: "Maximum number of images for this resource was reached"
        })
    }else {
        let newImage = await Image.create({
            url: url,
            preview: true,
            imageableId: review.id,
            imageableType: 'Review',
    
        })

        let safeResponse = {
            id: newImage.id,
            url: newImage.url
        }

        return res.status(200).json(safeResponse)

    }


})


router.put('/:reviewId', requireAuth, validateReview, async (req, res)=>{

    let user = req.user 
    let {reviewId} = req.params
    let {review, stars} = req.body
    

    let findReview = await Review.findByPk(reviewId)

    if(!findReview){
        return res.status(404).json({message:  "Review couldn't be found"})
    }

    if (findReview.userId !== user.id){
       return  res.status(403).json({message: 'Forbidden'})
    }else {
        findReview.review = review 
        findReview.stars = stars 

        await findReview.save()


        const createddate = new Date(findReview.createdAt).toISOString().replace('T', ' ').split('.')[0];
        const updateddate = new Date(findReview.updatedAt).toISOString().replace('T', ' ').split('.')[0];


        let saveResponse = {
            id: findReview.id,
            userId: findReview.userId,
            spotId: findReview.spotId,
            review: findReview.review,
            stars: findReview.stars,
            createdAt: createddate,
            updatedAt: updateddate
        }

        return res.status(200).json(saveResponse)
    }


})


router.delete('/:reviewId', requireAuth, async (req, res)=> {

    let user = req.user 

    let {reviewId} = req.params

    let review = await Review.findByPk(reviewId, {
        where: {
            userId: user.id 
        }
    })

    if (!review){
        return res.status(404).json({message: "Review couldn't be found"})
    }

    if (review.userId !== user.id){
       return  res.status(403).json({message: 'Forbidden'})
    }else {

        await review.destroy()
        
        return res.status(200).json({ message: "Successfully deleted" })

    }


})




module.exports = router;
