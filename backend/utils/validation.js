const { validationResult } = require('express-validator');
const {Booking} = require('../db/models')
const {Op} = require('sequelize')
const {Sequelize} = require('sequelize')

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);
      const response = {
        message: "Bad Request",
        errors: errors
      };
  
      return _res.status(400).json(response);
  }
  next();
};


const handleValidationErrorsUsers = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) { 
    // const errors = {};
    // validationErrors
    //   .array()
    //   .forEach(error => errors[error.path] = error.msg);

      return _res.status(400).json({
          message: "Bad Request",
            errors: {
              email: "Invalid email",
              username: "Username is required",
              firstName: "First Name is required",
              lastName: "Last Name is required"
            }
          
      });
  }
  next();
};


const handleValidationErrorsSpots = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) { 
    // const errors = {};
    // validationErrors
    //   .array()
    //   .forEach(error => errors[error.path] = error.msg);

      return _res.status(400).json({
          message: "Bad Request",
            errors: {
              address: "Street address is required",
              city: "City is required",
              state: "State is required",
              country: "Country is required",
              lat: "Latitude must be within -90 and 90",
              lng: "Longitude must be within -180 and 180",
              name: "Name must be less than 50 characters",
              description: "Description is required",
              price: "Price per day must be a positive number"
            }
          
      });
  }
  next();
};


async function checkBookingConflicts(req, res, next) {
  const { startDate, endDate } = req.body;

  const bookingConflict = await Booking.findOne({
    where: {
      spotId: req.params.spotId, 
      [Op.or]: [
        {
          startDate: {
            [Op.between]: [startDate, endDate]
          }
        },
        {
          endDate: {
            [Op.between]: [startDate, endDate]
          }
        }
      ]
    }
  });

  if (bookingConflict) {
    return res.status(403).json({
      message: 'Sorry, this spot is already booked for the specified dates',
      errors: {
        startDate: 'Start date conflicts with an existing booking',
        endDate: 'End date conflicts with an existing booking'
      }
    });
  }

  next();
}



async function checkBookingConflictsbookings(req, res, next) {
  const { startDate, endDate } = req.body;
  const {bookingId} = req.params 


    let booking = await Booking.findByPk(bookingId)
    if (!booking){
      return res.status(404).json({
        message: "Booking couldn't be found"
      });
    }

    const currentDate = new Date();
    if (booking.endDate < currentDate) {
      return res.status(403).json({
        message: "Past bookings can't be modified"
      });
    }

    const spotId = booking.spotId;

    const bookingConflict = await Booking.findOne({
      where: {
        spotId: spotId, 
        [Op.or]: [
          {
            startDate: {
              [Op.between]: [startDate, endDate]
            }
          },
          {
            endDate: {
              [Op.between]: [startDate, endDate]
            }
          }
        ]
      }
  });

  if (bookingConflict) {
    return res.status(403).json({
      message: 'Sorry, this spot is already booked for the specified dates',
      errors: {
        startDate: 'Start date conflicts with an existing booking',
        endDate: 'End date conflicts with an existing booking'
      }
    });
  }

  next();
}


module.exports = {
  handleValidationErrors, handleValidationErrorsUsers, handleValidationErrorsSpots, checkBookingConflicts, checkBookingConflictsbookings
};
