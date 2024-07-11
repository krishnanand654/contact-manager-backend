function validatePhoneNumber(req, res, next) {
    const { phoneNumbers } = req.body;

    if (phoneNumbers && !phoneNumbers.every(phoneNumber => /^\d{10}$/.test(phoneNumber))) {
        return res.status(400).json({ message: 'Invalid phone number format' });
    }

    next();
}

module.exports = validatePhoneNumber;
