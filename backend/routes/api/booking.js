const express = require('express')
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, Image, Review, Booking} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, handleValidationErrorsUsers, handleValidationErrorsSpots, checkBookingConflictsbookings, checkBookingConflictsUpdates } = require('../../utils/validation');


const router = express.Router();

const validateBookingUpdate = [
    check('startDate')
    .exists({ checkFalsy: true })
    .withMessage('Start date is required')
    // .isISO8601()
    .withMessage('Start date must be a valid date')
    .custom((value, { req }) => {
        if (new Date(value) < new Date()) {
            throw new Error('startDate cannot be in the past');
        }
        return true;
    }),
    check('endDate')
    .exists({ checkFalsy: true })
    .withMessage('End date is required')
    // .isISO8601()
    .withMessage('End date must be a valid date')
    .custom((value, { req }) => {
        if (new Date(value) <= new Date(req.body.startDate)) {
            throw new Error('endDate cannot be on or before startDate');
        }
        return true;
    }),

      handleValidationErrors,
      checkBookingConflictsUpdates
  ]


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


        let spotImage = await Image.findAll({
            where: {imageableType: 'Spot'},
            attributes: ['url']
        })


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


router.put('/:bookingId', requireAuth, validateBookingUpdate, async (req, res)=> {
    let currUser = req.user 
    let {bookingId} = req.params 
    let {startDate, endDate} = req.body 

    let booking = await Booking.findByPk(Number(bookingId))

    
    if (booking.userId === currUser.id){

        // await booking.update({ startDate, endDate });

        booking.startDate = startDate
        booking.endDate = endDate
    
        await booking.save()

        let createdAtDate = new Date(booking.createdAt);
        let upadatedAtDate = new Date(booking.updatedAt)

        createdAtDate = createdAtDate.toISOString().replace('T', ' ').split('.')[0];
        upadatedAtDate = upadatedAtDate.toISOString().replace('T', ' ').split('.')[0];

        let bookingStartDate = booking.startDate.toISOString().split('T')[0];
        let bookingEndDate = booking.endDate.toISOString().split('T')[0];

        let formattedResponse = {
            id: booking.id,
            spotId: booking.spotId,
            userId: booking.userId,
            startDate: bookingStartDate,
            endDate: bookingEndDate,
            createdAt: createdAtDate,
            updatedAt: upadatedAtDate

        }


       return res.status(200).json(formattedResponse)
    }


})


router.delete('/:bookingId', requireAuth, async (req, res) =>{

    let currUser = req.user 
    let {bookingId} = req.params





    let booking = await Booking.findByPk(bookingId, {
        where: {
            userId: currUser.id 
        }
    })

    if(!booking){
        res.status(404).json({message:  "Booking couldn't be found"})
    }


    let spotId = booking.spotId

    let spot = await Spot.findByPk(spotId)

  
    let currDate = new Date()
    let bookingStartDate = new Date(booking.startDate)

    if (bookingStartDate <= currDate){
        return res.status(403).json({
            message: "Bookings that have been started can't be deleted"
         });
    }

    if(booking.userId === currUser.id || spot.ownerId === currUser.id){
        
        await booking.destroy()

        return res.status(200).json({message: "Successfully deleted"})
    }else {
        return res.status(403).json({message: 'Forbidden'})
    }
})





module.exports = router;
