const express = require('express')
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, Image, Review, SpotImages, ReviewImages } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, handleValidationErrorsUsers, handleValidationErrorsSpots } = require('../../utils/validation');

const router = express.Router();
//user /spot/ image


// function findPreviewImage(spotImages) {
//     for (const image of spotImages) {
//         if (image.preview === true) {
//             return image.url;
//         }
//     }
//     return 'No preview image';
// }

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


        const spots = await Spot.findOne({
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

        const image = await Image.findOne({
            where: { imageableType: 'Spot' },
        })

        let spotImages = image.dataValues

        if (spotImages.preview === false) {
            spotImages.url = 'No preview image'
        }

        let reviewImages = await Image.findOne({
            where: { imageableType: 'Review' }
        })

        reviewImages = reviewImages.dataValues

        let removePreview = {
            id: reviewImages.id,
            url: reviewImages.url
        }

        const formattedReview = {
            ...review.toJSON(),
            createdAt: createdAtDate,
            updatedAt: upadatedAtDate,
            User: user,
            Spot: {
                id: spots.id,
                ownerId: spots.ownerId,
                address: spots.address,
                city: spots.city,
                state: spots.state,
                country: spots.country,
                lat: spots.lat,
                lng: spots.lng,
                name: spots.name,
                price: spots.price,
                previewImage: spotImages.url
            },

            ReviewImages: removePreview,

        };

        formattedReviews.push(formattedReview);

    }


    res.status(200).json({ Reviews: formattedReviews });


})


module.exports = router;
