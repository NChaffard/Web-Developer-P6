// Import dependancies
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
// Load environment variables
const dotenv = require('dotenv').config();
// Import Routes
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
// initialize app
const app = express();

// Connexion to database
mongoose.connect(process.env.DATABASE_URL,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion to MongoDB successfully established!'))
  .catch(() => console.log('Connexion to MongoDB failed !'));

// Set headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.ORIGIN_REQ_ADDRESS);
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});
// Parse in JSON
app.use(express.json());
// Add Routes
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);

module.exports = app;