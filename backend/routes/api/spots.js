const express = require('express')
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, Image } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, handleValidationErrorsUsers } = require('../../utils/validation');

const router = express.Router();


router.get('/', async (req, res)=>{

    let getAllSpots  = await Spot.findAll()

   let response = {Spots: getAllSpots}

   res.status(200).json(response)

})


router.get('/current', async (req, res)=> {

    let currentUser = req.user

    let user = await User.findOne({
        where: {id: currentUser.id},

    })

    let getUserSpots = await user.getSpots()

    let response = {Spots: getUserSpots}

    res.json(response)

  
})

router.get('/:id', async (req, res)=>{

    let {id} = req.params 
    id = Number(id)


    let spots = await Spot.findOne({
        where: {id},

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
            exclude: ['previewImage'] // Exclude the 'previewImage' attribute
          }

    })

    res.json(spots)
})





module.exports = router;
