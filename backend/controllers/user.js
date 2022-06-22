// Import dependancies
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// Import User model
const User = require('../models/User');

// Signup
exports.signup = (req, res, next) => {
  // Hash the password
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      // Then create a User instance with email from req.body and hashed password
      const user = new User({
        email: req.body.email,
        password: hash
      });
      // Then save the user in database
      user.save()
        .then(() => res.status(201).json({ message: 'User created successfully!' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// Login
exports.login = (req, res, next) => {
// Find user in database with his email
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        // If the user doesn't exist, return error
        return res.status(401).json({ error: 'User not found !' });
      }
    // Then compare password from user with password from database
    bcrypt.compare(req.body.password, user.password)
      .then(valid => {
        if (!valid) {
          // If passwords don't match return error
          return res.status(401).json({ error: 'Wrong password !' });
        }
        // If passwords match, return user_id and a token from user_id
        res.status(200).json({
          userId: user._id,
          token: jwt.sign(
            { userId: user._id},
            process.env.TOKEN_SECRET,
            { expiresIn: '24h'}
          )
      });
    })
      .catch(error => res.status(500).json({ error }));
  })
  .catch(error => res.status(500).json({ error }));
};