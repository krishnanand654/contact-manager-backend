const mongoose = require('mongoose');

const validateContact = (req, res, next) => {
    const { firstName, lastName, address, company, phoneNumbers } = req.body;
    const errors = [];

    if (!firstName || typeof firstName !== 'string' || firstName.trim() === '') {
        errors.push({ firstName: 'First name is required' });
    }

    if (!lastName || typeof lastName !== 'string' || lastName.trim() === '') {
        errors.push({ lastName: 'Last name is required' });
    }

    if (!address || typeof address !== 'string' || address.trim() === '') {
        errors.push({ address: 'Address is required' });
    }

    if (!company || typeof company !== 'string' || company.trim() === '') {
        errors.push({ company: 'Company is required' });
    }

    if (!Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
        errors.push({ phoneNumbers: 'At least one phone number is required' });
    } else {

        if (phoneNumbers[0].length === 0) {
            errors.push({ phoneNumbers: 'The first phone number is required' });
        } else if (typeof phoneNumbers[0] !== 'string' || !/^\d{10}$/.test(phoneNumbers[0])) {
            errors.push({ phoneNumbers: 'The first phone number must be 10 non-negative digits' });
        }


        for (let i = 1; i < phoneNumbers.length; i++) {
            if (phoneNumbers[i] && (typeof phoneNumbers[i] !== 'string' || !/^\d{10}$/.test(phoneNumbers[i]))) {
                errors.push({ phoneNumbers: `Phone number ${i + 1} must be 10 non-negative digits` });
            }
        }
    }
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

module.exports = validateContact;
