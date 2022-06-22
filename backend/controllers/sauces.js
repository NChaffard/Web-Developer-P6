// Import dependancies
const fs = require('fs');
// Import Sauce model
const Sauce = require('../models/Sauce');

// Create Sauce
exports.createSauce = (req, res, next) => {
  // Parsing string data in object format
  const sauceObject = JSON.parse(req.body.sauce);
  // Delete _id get from frontend
  delete sauceObject._id;
  // Create a Sauce instance with the data needed
  const sauce = new Sauce({
    ...sauceObject,
    likes: 0,
    dislikes: 0,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  // Then save sauce in database
  sauce.save()
  .then(() => res.status(201).json({ message: 'Sauce created successfully !'}))
  .catch(error => res.status(400).json({ error }));
};

// Get all sauces
exports.getAllSauces = (req, res, next) => {
  // Find all sauce from database
  Sauce.find().then(
    (sauces) => {
      // Return it in json format
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      // Else return error
      res.status(400).json({
        error: error
      });
    }
  );
};

// Get one sauce
exports.getOneSauce = (req, res, next) => {
  // Find a sauce in database with its id
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      // Then return it in json format
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      // Else return error
      res.status(404).json({
        error: error
      });
    }
  );
};

// Like or dislike sauce
exports.likeSauce = (req, res, next) => {
  // Create variables from req.body
  const userId = req.body.userId;
  const like = req.body.like;

  // Get the sauce
  Sauce.findOne({_id: req.params.id})
  .then((sauce)=>{
    // Then turn like and dislike from the user to zero
    if (sauce.usersLiked.indexOf(userId) > -1) {
      Sauce.updateOne({ _id: req.params.id}, { $inc: {likes: -1}, $pull: {usersLiked: userId} })
      .then(() => res.status(200).json({ message: 'Like deleted !'}))
      .catch(error => res.status(400).json({ error }));
    }
    if (sauce.usersDisliked.indexOf(userId) > -1) {
      Sauce.updateOne({ _id: req.params.id}, { $inc: {dislikes: -1}, $pull: {usersDisliked: userId} })
      .then(() => res.status(200).json({ message: 'Dislike deleted !'}))
      .catch(error => res.status(400).json({ error }));
    }
  })
  .then(()=>{
    // If like = 1, increment like and add userId in usersLiked 
    if (like === 1){
      Sauce.updateOne({ _id: req.params.id}, { $inc: {likes: 1}, $push: {usersLiked: userId} })
      .then(() => res.status(200).json({ message: 'Like added !'}))
      .catch(error => res.status(400).json({ error }));
    }
    // If like = -1, increment dislike and add userId in usersDisliked
    if (like === -1){
      Sauce.updateOne({ _id: req.params.id}, { $inc: {dislikes: 1}, $push: {usersDisliked: userId} })
      .then(() => res.status(200).json({ message: 'Dislike added !'}))
      .catch(error => res.status(400).json({ error }));
    }
  })
  .catch(error => res.status(500).json({ error }));
};

// Modify sauce
exports.modifySauce = (req, res, next) => {
  // If the image is modified
  const sauceObject = req.file ? (
    // Get the old image url
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      // Then delete it
      fs.unlink(`images/${filename}`, (error) => {
        if (error) {
          console.log(error);
        }
        else {
          console.log("Image deleted successfully");
        }
      });
    })
    .catch(error => res.status(500).json({ error })),
    // Put new data and new image url in sauceObject
    { ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` }
      ) :
    // Else get data from req.body and put on sauceObject
    { ...req.body };
    
    // Update the sauce in database with sauceObject
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modified !'}))
      .catch(error => res.status(400).json({ error }));
  };

// Delete sauce
exports.deleteSauce = (req, res, next) => {
  // Find the sauce
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      // If there is no sauce
      if (!sauce){
        res.status(404).json({
          error: new Error('There is no sauce !')
        });
      }
      // If the sauce was not created from the user
      if (sauce.userId !== req.auth.userId) {
        res.status(400).json({
          error: new error('Unauthorized request !')
        });
      }
      
      // Get image url
      const filename = sauce.imageUrl.split('/images/')[1];
      // Delete the image file
      fs.unlink(`images/${filename}`, () => {
        // Then delete the sauce from database
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce deleted !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};