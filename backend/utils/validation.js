const { validationResult } = require('express-validator');

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


module.exports = {
  handleValidationErrors, handleValidationErrorsUsers, handleValidationErrorsSpots,
};
