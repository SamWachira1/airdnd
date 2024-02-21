'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Image.belongsTo(models.Spot,{
        foreignKey: 'imageableId',
        constraints: false,
        as: 'SpotImage',
        scope: {
          imageableType: 'Spot'
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
      type: DataTypes.ENUM('User', 'Spot'),
      allowNull: false,
    },
    imageableId: {
      type: DataTypes.INTEGER,
      allowNull: false 
    }
  }, {
    sequelize,
    modelName: 'Image',
    defaultScope: {
      attributes: ['id', 'url', 'preview'],
    }


  });
  return Image;
};
