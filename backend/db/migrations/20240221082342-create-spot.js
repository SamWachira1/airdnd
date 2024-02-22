'use strict';
// /** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = 'Spots'
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(options.tableName, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ownerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Spots',
          key: 'id'
        },

        onDelete: 'CASCADE'
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lat: {
        type: Sequelize.DECIMAL,
        allowNull: false,

      },
      lng: {
        type: Sequelize.DECIMAL,
        allowNull: false,

      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,

      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,

      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,

      },
      // numReviews: {
      //   type: Sequelize.INTEGER,
      //   allowNull: false 
      // },

      // avgStarRating: {
      //   type: Sequelize.DECIMAL,
      //   allowNull: false,

      // },

      // previewImage: {
      //   type: Sequelize.STRING,
      //   allowNull: false,

      // },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")

      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")

      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(options);
  }
};
