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

      return _res.status(401).json({
        message: "Bad Request",
        errors: {
          credential: "Email or username is required",
          password: "Password is required"
        }
        
      });
  }
  next();
};

module.exports = {
  handleValidationErrors
};
