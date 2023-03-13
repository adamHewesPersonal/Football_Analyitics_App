const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

router.post('/register', (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  user.save((err, user) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Error registering new user.' });
    } else {
      console.log(`User ${user.username} has been registered.`);
      res.status(200).json({ message: 'User registered successfully!' });
    }
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username }, (err, user) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal error please try again' });
    } else if (!user) {
      res.status(401).json({ error: 'Incorrect username' });
    } else {
      user.isCorrectPassword(password, (err, same) => {
        if (err) {
          res.status(500).json({ error: 'Internal error please try again' });
        } else if (!same) {
          res.status(401).json({ error: 'Incorrect password' });
        } else {
          // Issue token
          const payload = { username };
          const token = jwt.sign(payload, config.secret, { expiresIn: '1h' });
          res.cookie('token', token, { httpOnly: true }).sendStatus(200);
        }
      });
    }
  });
});

module.exports = router;