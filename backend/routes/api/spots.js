const express = require('express')
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, handleValidationErrorsUsers } = require('../../utils/validation');

const router = express.Router();


router.get('/', async (req, res)=>{

    let getAllSpots  = await Spot.findAll()

   let response = {Spots: getAllSpots}

   res.status(200).json(response)

})



module.exports = router;
