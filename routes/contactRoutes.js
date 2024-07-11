const express = require('express');
const contactController = require('../controllers/contactController')
const authMiddleware = require('../middlewares/auth')
const contactMiddleware = require('../middlewares/contact')
const router = express.Router();

router.post('/create', authMiddleware, contactMiddleware, contactController.createContact);

router.get('/', authMiddleware, contactController.viewContactsByUser);

router.get('/:id', authMiddleware, contactController.viewContactsById);

router.delete('/delete/:id', authMiddleware, contactController.deleteContacts);

router.put('/update/:id', authMiddleware, contactController.updateContact);

module.exports = router;