const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');

const budget = require('./routes/api/budget');
const users = require('./routes/api/users');

const app = express();

// bodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require('./config/passport')(passport);

// dotenv config
require('dotenv').config();

// Use routes
app.use('/api/budget', budget);
app.use('/api/users', users);

app.use(express.static(path.join(__dirname, 'client', 'build')));

const port = process.env.PORT || 5000;

// Use Express to statically serve up client
app.use(express.static(path.join(__dirname, 'client', 'build')));

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.listen(port, () => console.log(`Server running on port ${port}...`));
