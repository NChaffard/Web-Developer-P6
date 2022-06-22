// Import dependancies
const mongoose = require('mongoose');

//  Create Sauce schema
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: true },
  dislikes: { type: Number, required: true},
  usersLiked: [ String ],
  usersDisliked: [ String ]
});
// Export model sauce from sauceSchema
module.exports = mongoose.model('Sauce', sauceSchema);