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
        review: 'Amazing!',
        stars: 4.5,
        userId: 3, 
        spotId: 2, 
      },
      {
        review: 'Incredible views!',
        stars: 4.6,
        userId: 4, 
        spotId: 2, 
      },
      {
        review: 'Great stuff really clean!',
        stars: 4.9,
        userId: 5, 
        spotId: 2, 
      },

      {
        review: 'Nice location, great views',
        stars: 4.5,
        userId: 2, 
        spotId: 1, 
      },

      {
        review: 'Cool spot',
        stars: 4.1,
        userId: 3, 
        spotId: 1, 
      },
      {
        review: 'Nice',
        stars: 4.6,
        userId: 4, 
        spotId: 1, 
      },

      {
        review: 'Better then the other one',
        stars: 3.8,
        userId: 5, 
        spotId: 1, 
      },

      {
        review: 'clean',
        stars: 4.3,
        userId: 1, 
        spotId: 3, 
      },
      {
        review: 'spotless',
        stars: 4.8,
        userId: 2, 
        spotId: 3, 
      },
      {
        review: 'bangers',
        stars: 4.3,
        userId: 4, 
        spotId: 3, 
      },
      {
        review: 'major bangers',
        stars: 4.0,
        userId: 5, 
        spotId: 3, 
      },

      {
        review: 'major bangers',
        stars: 4.2,
        userId: 1, 
        spotId: 4, 
      },
      {
        review: 'major bangers',
        stars: 4.0,
        userId: 2, 
        spotId: 4, 
      },
      {
        review: 'major bangers',
        stars: 4.8,
        userId: 3, 
        spotId: 4, 
      },
      {
        review: 'major bangers',
        stars: 5.0,
        userId: 5, 
        spotId: 4, 
      },

      {
        review: 'Dam son where did you find that one',
        stars: 5.0,
        userId: 1, 
        spotId: 5, 
      },

      {
        review: 'Yeah crib was smooth',
        stars: 5.0,
        userId: 2, 
        spotId: 5, 
      },
      {
        review: 'vibes',
        stars: 5.0,
        userId: 3, 
        spotId: 5, 
      },
      {
        review: 'major vibes',
        stars: 5.0,
        userId: 4, 
        spotId: 5, 
      },

    ], options, {validate: true})
  },

  async down (queryInterface, Sequelize) {


    options.tableName = 'Reviews'
    await queryInterface.bulkDelete(options, {})

  }
};
