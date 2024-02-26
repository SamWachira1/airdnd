const express = require('express')
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, Image, Review, Booking} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, handleValidationErrorsUsers, handleValidationErrorsSpots } = require('../../utils/validation');


const router = express.Router();



router.get('/current', requireAuth, async (req, res) => {

    let user = req.user 

     const bookings = await Booking.findAll({
        where: {userId: user.id}
    })

    for (let booking of bookings) {
        
        let spots = await Spot.findAll({
            where: {id: booking.spotId}
        })

        for (let spot of spots ){

    //  console.log("\n\n\n", spot[0].id, "\n\n\n")


        let spotImage = await Image.findAll({
            where: {imageableType: 'Spot'},
            attributes: ['url']
        })

        //  console.log("\n\n\n", spotImage[0].url , "\n\n\n")


        let createdAtDate = new Date(booking.createdAt);
        let upadatedAtDate = new Date(booking.updatedAt)

        createdAtDate = createdAtDate.toISOString().replace('T', ' ').split('.')[0];
        upadatedAtDate = upadatedAtDate.toISOString().replace('T', ' ').split('.')[0];
        
        let bookingStartDate = booking.startDate.toISOString().split('T')[0];
        let bookingEndDate = booking.endDate.toISOString().split('T')[0];

        
    
          const formattedSpot = {
                id: booking.id,
                spotId: booking.spotId,
                Spot: {
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
                previewImage: spotImage[0].url 
                },
                userId: booking.userId,
                startDate: bookingStartDate ,
                endDate: bookingEndDate,
                createdAt:createdAtDate,
                updatedAt: upadatedAtDate

            }


             return res.status(200).json({Bookings: [formattedSpot]})


        }


    }



})





module.exports = router;
