const express = require('express');
const authMiddleware = require('../middlewares/auth')
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/user', authMiddleware, userController.getUser);

module.exports = router;