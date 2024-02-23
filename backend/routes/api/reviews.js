const express = require('express')
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, Image, Review } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, handleValidationErrorsUsers, handleValidationErrorsSpots } = require('../../utils/validation');

const router = express.Router();

router.get('/current', requireAuth, async (req, res) => {
    let currUser = req.user

    let getUserReviews = await Review.findAll({
        where: { userId: currUser.id },

        include: [

            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },

            {
                model: Spot,
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
                'price']

            },

            {
                model: Image,
                as: 'ReviewImages',
                attributes: ['id', 'url'],
                scope: {
                    imageableType: 'Review'
                }
                
            }

        ]
    })


    const formattedReview = getUserReviews.map((spot) => {
        let createdAtDate = new Date(spot.createdAt);
        let upadatedAtDate = new Date(spot.updatedAt)

        createdAtDate = createdAtDate.toISOString().replace('T', ' ').split('.')[0];
        upadatedAtDate = upadatedAtDate.toISOString().replace('T', ' ').split('.')[0];

        return {
            ...spot.toJSON(),
            createdAt: createdAtDate,
            updatedAt: upadatedAtDate,
        };
    });

    let formattedResponse = {
        Reviews: formattedReview
    }


    res.status(200).json(formattedResponse)


})


module.exports = router;
