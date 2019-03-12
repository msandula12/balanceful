const Validator = require('validator');

const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
  const errors = {};

  // email
  if (isEmpty(data.email)) {
    errors.email = 'Email field is required';
  } else if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  // password
  if (isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
