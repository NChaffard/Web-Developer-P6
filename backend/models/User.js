// Import dependancies
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Create user Schema
const userSchema = mongoose.Schema({
  // email must be unique
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// load plugin unique validator
userSchema.plugin(uniqueValidator);

// Export model user from userSchema
module.exports = mongoose.model('User', userSchema);