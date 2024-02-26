'use strict';
const {Booking} = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
// /** @type {import('sequelize-cli').Migration} */


module.exports = {
  async up (queryInterface, Sequelize) {
 
    await Booking.bulkCreate([
      {
        userId: 1,
        spotId: 2,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      },

      {
        userId: 2,
        spotId: 1,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      },

    ], options, {validate: true})

  },

  async down (queryInterface, Sequelize) {
    
    options.tableName = 'Bookings'
    await queryInterface.bulkDelete(options, {})

  }
};
