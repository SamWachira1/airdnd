'use strict';
const {
  Model, Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {

    getImageable(options) {
      if (!this.imageableType) return Promise.resolve(null);
      const mixinMethodName = `get${this.imageableType}`;
      return this[mixinMethodName](options);
    }

    static associate(models) {
      // define association here
      

      Image.belongsTo(models.Spot,{
        foreignKey: 'imageableId',
        constraints: false,
        // as: 'Spot',
        scope: {
          imageableType: 'Spot'
        }
      })

      Image.belongsTo(models.Review, {
        foreignKey: 'imageableId',
        constraints: false,
        scope: {
          imageableType: 'Review'
        }
      })
    }
  }
  Image.init({
    url: {
      type: DataTypes.STRING,
      allowNull: false 
    },
    preview: {
      type: DataTypes.BOOLEAN,
      allowNull: false 
    },
    imageableType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: ['User', 'Spot', 'Review']
      }
    },
    imageableId: { 
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'Image',
    // defaultScope: {
    //   attributes: ['id', 'url', 'preview'],
    // }


  });
  return Image;
};
