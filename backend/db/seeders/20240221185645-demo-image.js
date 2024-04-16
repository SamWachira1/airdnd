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
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVbf2X2kDcfYV8-mS1LyOJ734JYqqyUOH8xw&s",
        preview: true,
        imageableType: 'Spot',
        imageableId: 1  
      },

      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWgJif1DJ8n0deBaF7RNBzbyvv041506ZEqw&s",
        preview: false,
        imageableType: 'Spot',
        imageableId: 1  
      },
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3qP3mkMqgvpkBRDTqWebE0QQOaFgtdiV4fg&s",
        preview: false,
        imageableType: 'Spot',
        imageableId: 1  
      },
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKtkUeHX73lO1GVmOVZU_oNP_NB2IITf_9Jg&s",
        preview: false,
        imageableType: 'Spot',
        imageableId: 1  
      },

      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKtkUeHX73lO1GVmOVZU_oNP_NB2IITf_9Jg&s",
        preview: false,
        imageableType: 'Spot',
        imageableId: 1  
      },
 
 
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpTfxYbknvusvsZs-aHitIgIQ_Yc2nBTe11w&s",
        preview: true,
        imageableType: 'Spot',
        imageableId: 2
      },
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWgJif1DJ8n0deBaF7RNBzbyvv041506ZEqw&s",
        preview: false,
        imageableType: 'Spot',
        imageableId: 2  
      },
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3qP3mkMqgvpkBRDTqWebE0QQOaFgtdiV4fg&s",
        preview: false,
        imageableType: 'Spot',
        imageableId: 2  
      },
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKtkUeHX73lO1GVmOVZU_oNP_NB2IITf_9Jg&s",
        preview: false,
        imageableType: 'Spot',
        imageableId: 2 
      },
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKtkUeHX73lO1GVmOVZU_oNP_NB2IITf_9Jg&s",
        preview: false,
        imageableType: 'Spot',
        imageableId: 2 
      },



      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWo9xLU6adbXiT14pNc5BZW4i6qav2l3eHbQ&s",
        preview: true,
        imageableType: 'Spot',
        imageableId: 3
      },
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWgJif1DJ8n0deBaF7RNBzbyvv041506ZEqw&s",
        preview: false,
        imageableType: 'Spot',
        imageableId: 3  
      },
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3qP3mkMqgvpkBRDTqWebE0QQOaFgtdiV4fg&s",
        preview: false,
        imageableType: 'Spot',
        imageableId: 3  
      },
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKtkUeHX73lO1GVmOVZU_oNP_NB2IITf_9Jg&s",
        preview: false,
        imageableType: 'Spot',
        imageableId: 3 
      },
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKtkUeHX73lO1GVmOVZU_oNP_NB2IITf_9Jg&s",
        preview: false,
        imageableType: 'Spot',
        imageableId: 3 
      },


      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHq_v53szcvJOs-4DI-Dsfqh_XEMOdi27fQA&s",
        preview: true,
        imageableType: 'Spot',
        imageableId: 4
      },
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWgJif1DJ8n0deBaF7RNBzbyvv041506ZEqw&s",
        preview: false,
        imageableType: 'Spot',
        imageableId: 4  
      },
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3qP3mkMqgvpkBRDTqWebE0QQOaFgtdiV4fg&s",
        preview: false,
        imageableType: 'Spot',
        imageableId: 4  
      },
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKtkUeHX73lO1GVmOVZU_oNP_NB2IITf_9Jg&s",
        preview: false,
        imageableType: 'Spot',
        imageableId: 4
      },
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKtkUeHX73lO1GVmOVZU_oNP_NB2IITf_9Jg&s",
        preview: false,
        imageableType: 'Spot',
        imageableId: 4
      },


      {
        url:  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYeqZ6ZiKEG-9_H3aCxOF0fJvJeK6e_OPecA&s",
        preview: true,
        imageableType: 'Spot',
        imageableId: 5
      },
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWgJif1DJ8n0deBaF7RNBzbyvv041506ZEqw&s",
        preview: false,
        imageableType: 'Spot',
        imageableId: 5  
      },
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3qP3mkMqgvpkBRDTqWebE0QQOaFgtdiV4fg&s",
        preview: false,
        imageableType: 'Spot',
        imageableId: 5  
      },
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKtkUeHX73lO1GVmOVZU_oNP_NB2IITf_9Jg&s",
        preview: false,
        imageableType: 'Spot',
        imageableId: 5
      },
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKtkUeHX73lO1GVmOVZU_oNP_NB2IITf_9Jg&s",
        preview: false,
        imageableType: 'Spot',
        imageableId: 5
      },


      // {
      //   url: 'image url',
      //   preview: true,
      //   imageableType: 'Review',
      //   imageableId: 1 
      // },

 
      // {
      //   url: 'image url',
      //   preview: false,
      //   imageableType: 'Review',
      //   imageableId: 2 
      // },

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
