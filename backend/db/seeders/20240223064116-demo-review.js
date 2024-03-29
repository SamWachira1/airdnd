'use strict';
const {Review} = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
// /** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {


    await Review.bulkCreate([
      {
        review: 'Great spot!',
        stars: 5.0,
        userId: 1, 
        spotId: 2, 
      },

      {
        review: 'Nice location, great views',
        stars: 4.5,
        userId: 2, 
        spotId: 1, 
      },

    ], options, {validate: true})
  },

  async down (queryInterface, Sequelize) {


    options.tableName = 'Reviews'
    await queryInterface.bulkDelete(options, {})

  }
};
