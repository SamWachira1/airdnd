const express = require('express')
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, Image, Review, Booking} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, handleValidationErrorsUsers, handleValidationErrorsSpots, checkBookingConflictsbookings } = require('../../utils/validation');



const router = express.Router();



router.delete('/:imageId', requireAuth, async (req, res)=>{

    // let user = req.user 

    // let {imageId} = req.params 

    // let image = await Image.findOne({
    //     where: {
    //         imageableId: imageId,
    //         imageableType: 'Spot'
    //     },

    // })


    // if (!image){
    //     res.status(404).json({message: "Spot Image couldn't be found" })
    // }



    // if (image.imageableType === 'Spot'){
    //     let spotBelongsUser = await Spot.findOne({
    //         where: {
    //             id: image.imageableId,
    //             ownerId: user.id 
    //         }

    //     })

    //     console.log("\n\n\n", spotBelongsUser, "\n\n\n")




    //     if (!spotBelongsUser){
    //         return res.status(403).json({message: 'Forbidden'})
    //     }else {
    //         await image.destroy();

    //         return res.status(200).json({message: "Successfully deleted"})


    //     }

    // }

    // // return res.status(200).json({message: "Successfully "})

    try {
        // 1. Retrieve authenticated user and image information
        const user = req.user;
        const { imageId } = req.params;

        // 2. Find the image with validation
        const image = await Image.findOne({
            where: {
                id: imageId, // Use `id` instead of `imageableId` for accurate association
                imageableType: 'Spot',
            },
            include: {
                model: Spot,
                // as: 'Spot',
                attributes: ['id', 'ownerId'], // Select only needed attributes
            },
        });

        console.log("\n\n\n", image, "\n\n\n")

        // 3. Handle non-existent image with 404
        if (!image) {
            return res.status(404).json({ message: 'Spot Image not found' });
        }

        // 4. Check authorization and ownership efficiently
        if (user.id !== image.ownerId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        // 5. Delete the image and respond with success
        await image.destroy();
        return res.status(200).json({ message: 'Successfully deleted' });
    } catch (error) {
        // 6. Handle potential errors gracefully
        console.error(error);
        return res.status(500).json({ message: 'Error deleting image' });
    }


})





module.exports = router;
