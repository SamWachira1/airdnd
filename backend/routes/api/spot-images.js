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

    let image = await Image.findByPk(imageId)

      console.log("\n\n\n",image , "\n\n\n")


    if (!image){
        res.status(404).json({message: "Spot Image couldn't be found" })
    }

    if (image.imageableType === 'Spot'){
        let spotBelongsUser = await Spot.findOne({
            where: {
                id: image.imageableId,
                ownerId: user.id 
            }
        })

        if (!spotBelongsUser){
            return res.status(404).json({message: 'Forbidden'})
        }else {
            await image.destroy();

            return res.status(200).json({message: "Successfully deleted"})


        }

    }

    // return res.status(200).json({message: "Successfully "})


})





module.exports = router;
