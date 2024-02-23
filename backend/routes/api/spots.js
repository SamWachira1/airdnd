const express = require('express')
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, Image, Review } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, handleValidationErrorsUsers, handleValidationErrorsSpots } = require('../../utils/validation');
const Sequelize = require('sequelize');

const router = express.Router();

const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Street address is required"),
    check('city')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("City is required"),
    check('state')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("State is required"),
    check('country')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Country is required"),
    check('lat')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isFloat({ min: -90, max: 90 })
        .withMessage("Latitude must be within -90 and 90"),

    check('lng')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isFloat({ min: -180, max: 180 })
        .withMessage("Longitude must be within -180 and 180"),

    check('name')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isLength({ max: 50 })
        .withMessage("Name must be less than 50 characters"),

    check('description')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Description is required"),

    check('price')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isFloat({ gt: 0 })
        .withMessage("Price per day must be a positive number"),

    handleValidationErrorsSpots

];



router.post("/:spotId/images", requireAuth, async (req, res) => {

    const currUser = req.user;


    const { spotId } = req.params;
    const { url, preview } = req.body;
    const spot = await Spot.findOne({ where: { id: spotId } });

    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId === currUser.id) {
        const newImage = await Image.create({
            url,
            preview,
            imageableId: spot.id,
            imageableType: 'Spot',
        });


        const safeResponse = {
            url: newImage.url,
            preview: newImage.preview
        }

        res.status(200).json(safeResponse)
    }



});


router.put('/:spotId', requireAuth, validateSpot, async (req, res) => {

    const currUser =  req.user;
    const { spotId } = req.params
    const { address, city, state, country, lat, lng, name, description, price } = req.body

    let spot = await Spot.findOne({ where: { id: spotId } })

    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId === parseInt(currUser.id)) {

        spot.address = address
        spot.city = city;
        spot.state = state;
        spot.country = country;
        spot.lat = lat;
        spot.lng = lng;
        spot.name = name;
        spot.description = description;
        spot.price = price;

        await spot.save()

        const date = new Date(spot.createdAt).toISOString().replace('T', ' ').split('.')[0];
        const responseEdit = {
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createdAt: date,
            updatedAt: date,
        };

        res.status(200).json(responseEdit)

    }



})

router.get('/current', requireAuth, async (req, res) => {
    // console.log("\n\n\n",req.user , "\n\n\n")
    // console.log("\n\n\n",req.user , "\n\n\n")
    let currentUser = req.user
    // console.log("\n\n\n",currentUser , "\n\n\n")

    // console.log(req.user)

    let getUserSpots = await Spot.findAll({

        where: { ownerId: currentUser.id },

    })

    if (!getUserSpots) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    const formattedSpots = getUserSpots.map((spot) => {
        let createdAtDate = new Date(spot.createdAt);
        let upadatedAtDate = new Date(spot.updatedAt)

        createdAtDate = createdAtDate.toISOString().replace('T', ' ').split('.')[0];
        upadatedAtDate = upadatedAtDate.toISOString().replace('T', ' ').split('.')[0];

        return {
            ...spot.toJSON(),
            createdAt: createdAtDate,
            updatedAt: upadatedAtDate,
        };
    });


    let response = {
        Spots: formattedSpots,
    };


    res.json(response)



})


router.get('/:id', async (req, res) => {

    let { id } = req.params
    let spotId = Number(id)

    let getAllSpots = await Spot.findAll({

        where: { id: spotId },

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

    })

    if (!getAllSpots || getAllSpots.length === 0) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    let formattedResponse = getAllSpots.map((spot) => {

        let createdAtDate = new Date(spot.createdAt)
        let upadatedAtDate = new Date(spot.updatedAt)

        createdAtDate = createdAtDate.toISOString().replace('T', ' ').split('.')[0];
        upadatedAtDate = upadatedAtDate.toISOString().replace('T', ' ').split('.')[0];

        return {
            ...spot.toJSON(),
            createdAt: createdAtDate,
            updatedAt: upadatedAtDate
        }


    })

    res.json(formattedResponse)


})

router.delete('/:spotId', requireAuth, async (req, res) => {

    let { spotId } = req.params

    let spot = await Spot.findOne({ where: { id: spotId } })

    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    await spot.destroy()

    res.status(200).json({ message: "Successfully deleted" })

})



router.get('/', async (req, res) => {

    let getAllSpots = await Spot.findAll({
        attributes: [
            'id',
            'ownerId',
            "address",
            "city",
            "state",
            "country",
            "lat",
            "lng",
            "name",
            "description",
            "price",
            "createdAt",
            "updatedAt",

            [Sequelize.fn('avg', Sequelize.col('Reviews.stars')), 'avgRating']
        ],
        include: [
            {
                model: Review,
                attributes: [], // Include reviews but don't fetch their attributes
                where: { spotId: Sequelize.col('Spot.id') }, // Join based on spotId
            },
            {
                model: Image,
                attributes: ['url'],
                as: 'SpotImages', // Assuming your association alias is 'SpotImages'
                where: { imageableType: 'Spot' }, // Filter images by Spot
            },
        ],
        group: ['Spot.id'], 
    })


    let getFormatedResponse = getAllSpots.map((spot) => {

        let createdAtDate = new Date(spot.createdAt);
        let upadatedAtDate = new Date(spot.updatedAt)
    
        createdAtDate = createdAtDate.toISOString().replace('T', ' ').split('.')[0];
        upadatedAtDate = upadatedAtDate.toISOString().replace('T', ' ').split('.')[0];


           let safeResponse =  {
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
            createdAt: createdAtDate,
            updatedAt: upadatedAtDate,
            avgRating: spot.dataValues.avgRating, // had to access dataValues again
            previewImage: spot.SpotImages[0].url
        }

        return safeResponse

    })

    let response = {
        Spots: getFormatedResponse
    }

    res.status(200).json(response)

})




router.post('/', requireAuth, validateSpot, async (req, res) => {

    const currentUser = req.user; // Wait for user data

    if (!currentUser) res.json({ message: 'No user logged in' })

    let { address, city, state, country, lat, lng, name, description, price } = req.body

    if (currentUser) {

        let newSpot = await Spot.create({
            ownerId: currentUser.id,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,

        })

        const safeSpot = {
            id: newSpot.id,
            ownerId: newSpot.ownerId,
            address: newSpot.address,
            city: newSpot.city,
            state: newSpot.state,
            country: newSpot.country,
            lat: newSpot.lat,
            lng: newSpot.lng,
            name: newSpot.name,
            description: newSpot.description,
            price: newSpot.price

        }


        res.status(201).json(safeSpot)
    }


})




module.exports = router;
