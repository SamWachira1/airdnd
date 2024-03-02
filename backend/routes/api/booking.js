const express = require('express')
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, Image, Review, Booking} = require('../../db/models');
const { check } = require('express-validator');
const {Op} = require('sequelize')
const { handleValidationErrors, handleValidationErrorsUsers, handleValidationErrorsSpots, checkBookingConflictsbookings, checkBookingConflictsUpdates } = require('../../utils/validation');


const router = express.Router();

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

  ]

router.get('/current', requireAuth, async (req, res) => {

    let user = req.user 

     const bookings = await Booking.findAll({
        where: {userId: user.id}
    })

    if (!bookings){
        return res.status(404).json({message: 'Bookings could not be found'})
    }



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

        let floatPrice = parseFloat(spot.price.toFixed(1))
    
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
                price: floatPrice,
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


router.put('/:bookingId', requireAuth, validateBooking, async (req, res)=> {
    let currUser = req.user 
    let {bookingId} = req.params 
    let {startDate, endDate} = req.body 

    let booking = await Booking.findByPk(Number(bookingId))

    if (!booking){
        return res.status(404).json({message: 'Booking could not be found'})
    }


    let queriedEndTime = new Date (booking.endDate).getTime()


    if (!booking){
        return res.status(404).json({message: 'Booking could not be found'})
    }

    if (booking.userId !== currUser.id){
        return res.status(403).json({message: 'Forbidden'})
    }

    let startBookingDate = new Date (startDate).getTime()
    let endBookingDate = new Date (endDate).getTime()

    let currDateTime = new Date().getTime()

    if (currDateTime > queriedEndTime ){
        res.status(403).json({message: "Past bookings can't be modified"})
    }

    let excludingCurrentBooking = await Booking.findAll({
        where: {
            id: {
                [Op.ne]: bookingId
            },

            spotId: booking.spotId 

            
        }
    })

 

    for (let otherBooking of excludingCurrentBooking){

        let startDateOtherBooking = new Date(otherBooking.startDate).getTime()
        let endingDateOtherBooking = new Date (otherBooking.endDate).getTime()
      
        if ((startBookingDate < endingDateOtherBooking && endBookingDate > startDateOtherBooking) || 
           (startBookingDate === endingDateOtherBooking || endBookingDate === startDateOtherBooking)) {


            return res.status(403).json({
                message: 'Sorry, this spot is already booked for the specified dates',
                errors: {
                  startDate: 'Start date conflicts with an existing booking',
                  endDate: 'End date conflicts with an existing booking'
                }
            });
        }

    } 




    
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
