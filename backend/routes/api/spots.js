const express = require('express')
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, Image } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, handleValidationErrorsUsers } = require('../../utils/validation');

const router = express.Router();


router.get('/', async (req, res)=>{

    let getAllSpots  = await Spot.findAll()

   let getFormatedResponse = getAllSpots.map((spot)=> {
        const date = new Date(spot.createdAt);
        const formattedCreatedAt = date.toISOString().replace('T', ' ').split('.')[0];
        const formattedUpdatedAt = date.toISOString().replace('T', ' ').split('.')[0];

        return {
            ...spot.toJSON(),
            createdAt: formattedCreatedAt,
            updatedAt: formattedUpdatedAt,
        }; 
   })

   let response = {
    Spots: getFormatedResponse
   }

   res.status(200).json(response)

})


router.get('/current', async (req, res)=> {

    let currentUser = req.user

    let user = await User.findOne({
        where: {id: currentUser.id},

    })

    let getUserSpots = await user.getSpots()


    const formattedSpots = getUserSpots.map((spot) => {
        const date = new Date(spot.createdAt);
        const formattedCreatedAt = date.toISOString().replace('T', ' ').split('.')[0];
        const formattedUpdatedAt = date.toISOString().replace('T', ' ').split('.')[0];

        return {
            ...spot.toJSON(),
            createdAt: formattedCreatedAt,
            updatedAt: formattedUpdatedAt,
        };
    });


    let response = {
        Spots: formattedSpots,
    };


    res.json(response)

  
})

router.get('/:spotId', async (req, res)=>{

    let {spotId} = req.params
    
    id = Number(spotId)
    
    let spots = await Spot.findOne({
        where: {id: id},

        include: [
            {
                model: Image,
                as: 'SpotImages',
                attributes: ['id', 'url', 'preview']
            },

            {
                model: User,
                as: 'Owner',
                attributes: ['id', 'firstName', 'lastName'],
            },

        ],

        attributes: {
            exclude: ['previewImage'] 
          }

    })


    if (!spots) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }


    let date = new Date(spots.createdAt)
    date = date.toISOString().replace('T', ' ').split('.')[0];

    const responseSpot = {
        ...spots.toJSON(), 
        createdAt: date,
        updatedAt: date
      };
      


    res.json(responseSpot)
})





module.exports = router;
