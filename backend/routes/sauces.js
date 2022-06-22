// Import dependancies
const express = require('express');
const router = express.Router();
// Import middlewares
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
// Import sauces controller
const saucesCtrl = require('../controllers/sauces');
// Create routes
router.get('/',saucesCtrl.getAllSauces);
router.get('/:id',auth, saucesCtrl.getOneSauce);
router.post('/',auth, multer, saucesCtrl.createSauce);
router.post('/:id/like',auth, saucesCtrl.likeSauce);
router.put('/:id',auth, multer, saucesCtrl.modifySauce);
router.delete('/:id',auth, saucesCtrl.deleteSauce);

module.exports = router;