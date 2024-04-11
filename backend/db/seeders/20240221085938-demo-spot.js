'use strict';
const {Spot} = require('../models')
const bcrypt = require("bcryptjs");

// /** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


module.exports = {
  async up (queryInterface, Sequelize) {
 
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: "123 Disney Lane",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "Monterray",
        description: "Place where web developers are created",
        price: 23534.34,
        numReviews: 5,
        avgStarRating: 4.5,
        previewImage: "https://media.istockphoto.com/id/1026205392/photo/beautiful-luxury-home-exterior-at-twilight.jpg?s=612x612&w=0&k=20&c=HOCqYY0noIVxnp5uQf1MJJEVpsH_d4WtVQ6-OwVoeDo="
      },

      {
        ownerId: 2,
        address: "1233 Disney Lane",
        city: "Los Angels",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -120.4730327,
        name: "Advin",
        description: "Place where web developers are created",
        price: 30500.23,
        numReviews: 5,
        avgStarRating: 4.8,
        previewImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpTfxYbknvusvsZs-aHitIgIQ_Yc2nBTe11w&s"
      },
      {
        ownerId: 1,
        address: "44 BullDog St.",
        city: "San Bernardino",
        state: "California",
        country: "United States of America",
        lat: 40.7645358,
        lng: -121.4730327,
        name: "LexAir",
        description: "Place where web developers are created",
        price: 30000.00,
        numReviews: 5,
        avgStarRating: 4.2,
        previewImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWo9xLU6adbXiT14pNc5BZW4i6qav2l3eHbQ&s"
      },
      {
        ownerId: 2,
        address: "12 AirJodan St.",
        city: "Santa Monica",
        state: "California",
        country: "United States of America",
        lat: 40.7645358,
        lng: -121.4730327,
        name: "Belmont",
        description: "Place where web developers are created",
        price: 30000.00,
        numReviews: 5,
        avgStarRating: 4.9,
        previewImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHq_v53szcvJOs-4DI-Dsfqh_XEMOdi27fQA&s"
      },

      {
        ownerId: 2,
        address: "12 AirJodan St.",
        city: "Santa Monica",
        state: "California",
        country: "United States of America",
        lat: 40.7645358,
        lng: -121.4730327,
        name: "Andrews",
        description: "Place where web developers are created",
        price: 30000.00,
        numReviews: 5,
        avgStarRating: 4.2,
        previewImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYeqZ6ZiKEG-9_H3aCxOF0fJvJeK6e_OPecA&s"
      },
 
    ], options, { validate: true });
    



  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots'
    const Op = Sequelize.Op;

    await queryInterface.bulkDelete(options, {})
  }
};
