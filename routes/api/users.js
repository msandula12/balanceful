const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const keys = require('../../config/keys');

// Load input validations
const validateLoginInput = require('../../validation/login');
const validateRegisterInput = require('../../validation/register');

// Load User model
const User = require('../../models/User');

// Login token expires after 6 hours
const LOGIN_EXPIRATION = '6h';

/**
 * @route POST api/users/register
 * @desc Register a user
 * @access Public
 */
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({
    email: req.body.email
  }).then(user => {
    if (user) {
      errors.email = 'A user with this email address already exists';
      return res.status(400).json(errors);
    } else {
      const { email, name, password } = req.body;
      const avatar = gravatar.url(email, {
        s: '200', // Size
        r: 'pg', // Rating
        d: 'mm' // Default
      });
      const newUser = new User({
        avatar,
        email,
        name,
        password
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

/**
 * @route POST api/users/login
 * @desc Login user (return JWT)
 * @access Public
 */
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email, password } = req.body;

  // Find user by email
  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = 'User not found';
      return res.status(404).json(errors);
    }

    // Validate password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = { avatar: user.avatar, id: user.id, name: user.name };
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: LOGIN_EXPIRATION },
          (err, token) => {
            if (err) {
              errors.user = 'Could not log in user';
              res.status(400).json(errors);
            }
            res.json({
              success: true,
              token: `Bearer ${token}`
            });
          }
        );
      } else {
        errors.password = 'Password incorrect';
        return res.status(400).json(errors);
      }
    });
  });
});

/**
 * @route GET api/users/current
 * @desc Return current user
 * @access Private
 */
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      avatar: req.user.avatar,
      email: req.user.email,
      name: req.user.name
    });
  }
);

module.exports = router;
