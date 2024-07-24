const express = require('express');
const authMiddleware = require('../middlewares/auth')
const userController = require('../controllers/userController');
const router = express.Router();
const upload = require('../middlewares/upload');
const { userValidationRules, validate } = require('../middlewares/validateRegistration');


router.get('/user', authMiddleware, userController.getUser);
router.put('/user-update', (req, res, next) => {
    upload.single('profilePicture')(req, res, (err) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        next();
    });
}, authMiddleware, userController.updateUser);


module.exports = router;