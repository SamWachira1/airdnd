'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.User,{
        foreignKey: 'userId'
      })

      Review.belongsTo(models.Spot, {
        foreignKey: 'spotId'
      })

      Review.hasMany(models.Image, {
        foreignKey: 'imageableId',
        constraints: false,
        scope: {
          imageableType: 'Review'
        },
      })
    }
  }
  Review.init({
    review: {
      type: DataTypes.STRING,
      allowNull: false 
    },
    stars:{ 
      type: DataTypes.FLOAT,
      validate: {
        min: 1.0,
        max: 5.0
      }
    },
    userId: DataTypes.INTEGER,
    spotId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
