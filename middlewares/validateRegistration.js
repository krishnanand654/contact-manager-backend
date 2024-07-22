function validatePassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
}


function validateRegistration(req, res, next) {
    const { firstName, lastName, email, password, confirmPassword, dateOfBirth, gender, phoneNumbers, address } = req.body;
    const errors = [];

    // First Name validation
    if (!firstName) {
        errors.push({ field: 'firstName', message: 'First Name is required' });
    } else if (!/^[A-Za-z]+$/.test(firstName)) {
        errors.push({ field: 'firstName', message: 'First Name must contain only alphabetic characters' });
    } else if (firstName.length < 2) {
        errors.push({ field: 'firstName', message: 'First Name must be at least 2 characters long' });
    }

    // Last Name validation
    if (!lastName) {
        errors.push({ field: 'lastName', message: 'Last Name is required' });
    } else if (!/^[A-Za-z\s]+$/.test(lastName)) {
        errors.push({ field: 'lastName', message: 'Last Name must contain only alphabetic characters' });
    } else if (lastName.length < 2) {
        errors.push({ field: 'lastName', message: 'Last Name must be at least 2 characters long' });
    }

    // Email validation
    if (!email) {
        errors.push({ field: 'email', message: 'Email Address is required' });
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        errors.push({ field: 'email', message: 'Invalid Email Address' });
    }

    // Password validation
    if (!validatePassword(password)) {
        errors.push({ field: 'password', message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number' });
    } else if (password.length < 8) {
        errors.push({ field: 'password', message: 'Password must be at least 8 characters long' });
    }

    // Confirm Password validation
    if (!confirmPassword) {
        errors.push({ field: 'confirmPassword', message: 'Confirm Password is required' });
    } else if (confirmPassword !== password) {
        errors.push({ field: 'confirmPassword', message: 'Password confirmation does not match password' });
    }

    // Date of Birth validation
    if (!dateOfBirth) {
        errors.push({ field: 'dob', message: 'Date of Birth is required' });
    } else {
        const dobDate = new Date(dateOfBirth);
        const today = new Date();
        if (isNaN(dobDate.getTime())) {
            errors.push({ field: 'dob', message: 'Invalid Date of Birth' });
        } else if (dobDate > today) {
            errors.push({ field: 'dob', message: 'Date of Birth cannot be in the future' });
        } else {
            let age = today.getFullYear() - dobDate.getFullYear();
            const m = today.getMonth() - dobDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
                age--;
            }
            if (age < 18) {
                errors.push({ field: 'dateOfBirth', message: 'You must be at least 18 years old' });
            }
        }
    }

    // Gender validation
    if (!gender) {
        errors.push({ field: 'gender', message: 'Gender is required' });
    } else if (!['Male', 'Female', 'Other', 'male', 'female', 'other', 'm', 'f'].includes(gender)) {
        errors.push({ field: 'gender', message: 'Invalid Gender' });
    }

    // Phone Number validation
    if (!phoneNumbers) {
        errors.push({ field: 'phoneNumbers', message: 'Phone Number is required' });
    } else if (!/^(?:\+\d{1,3}\s*)?(?:\(\d{3}\)|\d{3})[-.\s]*\d{3}[-.\s]*\d{4}$/.test(phoneNumbers)) {
        console.log(phoneNumbers)
        errors.push({ field: 'phone', message: 'Invalid Phone Number' });
    }

    // Address validation
    if (!address) {
        errors.push({ field: 'address', message: 'Address is required' });
    }


    if (errors.length > 0) {
        return res.status(422).json({ errors });
    }

    next();
};

module.exports = validateRegistration;
