const {Router} = require('express');
const router = Router();
const authController = require('../controllers/authController');
const userProfileController = require('../controllers/userProfileController');
const authentication = require("../middlewares/authentication");

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.get('/profile', authentication, userProfileController.getUserProfile);
router.put('/profile/passwordupdate', authentication , userProfileController.updatePassword);
router.put('/profile/profileupdate', authentication, userProfileController.updateProfile);

module.exports = router;
