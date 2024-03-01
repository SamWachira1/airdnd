const express = require('express')
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, Image, Review, Booking} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, handleValidationErrorsUsers, handleValidationErrorsSpots, checkBookingConflictsbookings } = require('../../utils/validation');



const router = express.Router();



router.delete('/:imageId', requireAuth, async (req, res)=>{

    let user = req.user 

    let {imageId} = req.params 

    let image = await Image.findOne({
        where: {
            id: imageId,
            imageableType: 'Spot'
        }
    })

    // console.log("\n\n\n", image, "\n\n\n")


    if (!image){
        return res.status(404).json({message: "Spot Image couldn't be found" })
    }



    if (image.imageableType === 'Spot'){
        let spotBelongsUser = await Spot.findOne({
            where: {
                id: image.imageableId,
                ownerId: user.id 
            }

        })

        // console.log("\n\n\n", spotBelongsUser, "\n\n\n")


        if (!spotBelongsUser){
            return res.status(403).json({message: 'Forbidden'})
        }else {
            await image.destroy();

            return res.status(200).json({message: "Successfully deleted"})


        }

    }else {
        return res.status(404).json({message: "Spot Image couldn't be found" })
    }


})





module.exports = router;
