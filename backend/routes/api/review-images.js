const express = require('express')
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, Image, Review, Booking} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, handleValidationErrorsUsers, handleValidationErrorsSpots, checkBookingConflictsbookings } = require('../../utils/validation');



const router = express.Router();


router.delete('/:imageId', requireAuth, async (req, res)=>{
    let {imageId} = req.params 
    let currUser = req.user 


    let image = await Image.findOne({
        where: {
            imageableType: 'Review',
            imageableId: imageId
        }
    })

    if (!image){
        return res.status(404).json({message: "Review Image couldn't be found"})
    }

    if (image.imageableType === 'Review'){
        let reviewBelongsUser = await Review.findOne({
            where: {
                id: image.imageableId,
                userId: currUser.id 
            }
        })

        // console.log("\n\n\n", reviewBelongsUser, "\n\n\n")

        if(!reviewBelongsUser){
            return res.status(404).json({message: 'Forbidden'})
        }else {
            await image.destroy()

            return res.status(200).json({message: "Successfully deleted"})

            // return res.status(200).json(reviewBelongsUser)
        }
    }


})


module.exports = router;
