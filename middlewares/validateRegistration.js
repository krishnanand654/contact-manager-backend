const { body, validationResult } = require('express-validator');

const userValidationRules = () => [
    body('firstName').notEmpty().withMessage('First name is required'),
    // body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Email is invalid'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number')
        .matches(/[\W]/).withMessage('Password must contain at least one special character'),
    body('confirmPassword')
        .exists().withMessage('Confirm password is required')
        .custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match'),
    body('dateOfBirth').isDate().withMessage('Date of birth is required'),
    body('gender').notEmpty().withMessage('Gender is required'),
    body('phoneNumber').isLength({ min: 10 }).withMessage('Phone Number must be of length 10').isAlphanumeric().withMessage('Phone number should be digits').notEmpty().withMessage('Phone number is required'),
    body('address.street').notEmpty().withMessage('Street address is required'),
    body('address.city').notEmpty().withMessage('City is required'),
    body('address.state').notEmpty().withMessage('State is required'),
    body('address.postalCode').isAlphanumeric().withMessage('Postal code should be number').notEmpty().withMessage('Postal code is required'),
    body('address.country').notEmpty().withMessage('Country is required'),
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

    return res.status(422).json({
        errors: extractedErrors,
    });
};

module.exports = {
    userValidationRules,
    validate,
};
