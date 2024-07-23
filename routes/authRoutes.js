const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Adjust the path as necessary
const upload = require('../middlewares/upload'); // Adjust the path as necessary
// const validateRegistration = require('../middlewares/validateRegistration');
const { userValidationRules, validate } = require('../middlewares/validateRegistration');

// User registration route
router.post('/register', (req, res, next) => {
    upload.single('profilePicture')(req, res, (err) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        next();
    });
}, userValidationRules(), validate, authController.register);


// User login route
router.post('/login', authController.login);

// Refresh token route
router.post('/refresh-token', authController.refreshToken);

module.exports = router;
