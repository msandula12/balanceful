const Validator = require('validator');

const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
  const errors = {};

  // email
  if (isEmpty(data.email)) {
    errors.email = 'Email field is required';
  } else if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  // name
  if (isEmpty(data.name)) {
    errors.name = 'Name field is required';
  } else if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }

  // password
  if (isEmpty(data.password)) {
    errors.password = 'Password field is required';
  } else if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be between 6 and 30 characters';
  }

  // password2
  if (isEmpty(data.password2)) {
    errors.password2 = 'Confirm password field is required';
  } else if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = 'Passwords must match';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
