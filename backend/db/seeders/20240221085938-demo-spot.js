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
        name: "App Academy",
        description: "Place where web developers are created",
        price: 23534.34,
        numReviews: 5,
        avgStarRating: 4.5,
        previewImage: "image url"
      },

      {
        ownerId: 2,
        address: "1233 Disney Lane",
        city: "Los Angels",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -120.4730327,
        name: "App Academy",
        description: "Place where web developers are created",
        price: 30500.23,
        numReviews: 5,
        avgStarRating: 4.8,
        previewImage: "image url"
      },
 
    ], options, { validate: true });
    



  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots'
    const Op = Sequelize.Op;

    await queryInterface.bulkDelete(options, {})
  }
};
