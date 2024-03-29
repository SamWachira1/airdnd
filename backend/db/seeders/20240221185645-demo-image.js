'use strict';
const {Image} = require('../models')
const bcrypt = require("bcryptjs");

// /** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
 
    await Image.bulkCreate([
      {
        url: 'image url',
        preview: true,
        imageableType: 'Spot',
        imageableId: 1  
      },

      {
        url: 'image url',
        preview: false,
        imageableType: 'Review',
        imageableId: 1 
      },

      {
        url: 'image url',
        preview: true,
        imageableType: 'Spot',
        imageableId: 2
      },

      {
        url: 'image url',
        preview: false,
        imageableType: 'Review',
        imageableId: 2 
      },

    ], options, {validate: true })
    

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Images'
    await queryInterface.bulkDelete(options, {})
  }
};
