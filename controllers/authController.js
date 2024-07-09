const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');
const uuid = require('uuid');
const bcrypt = require('bcrypt');

// Generate Access Token
function generateAccessToken(user) {
    return jwt.sign(user, config.secretKey, { expiresIn: config.expiresIn });
}

// Generate Refresh Token
function generateRefreshToken(user) {
    return jwt.sign(user, config.refreshSecretKey, { expiresIn: config.refreshExpiresIn });
}

function validatePassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return regex.test(password);
}


// User Registration
exports.register = async (req, res) => {
    const { password, confirmPassword, ...userData } = req.body;

    // Password validation
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    if (!validatePassword(password)) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number' });
    }

    try {
        // Hashing password before saving user

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new User({
            ...req.body,
            password: hashedPassword,
        });

        if (!req.body.refreshToken) {
            newUser.refreshToken = uuid.v4();
        }

        if (req.file) {
            newUser.profilePicture = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            };
        }

        await newUser.save();
        res.status(201).json({ message: "User registration successful" });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern.username) {
            res.status(400).json({ message: 'Username already exists' });
        } else if (error.code === 11000 && error.keyPattern.email) {
            res.status(400).json({ message: 'Email already exists' });
        } else {
            res.status(400).json({ message: 'Error registering user', error });
        }
    }
};

// User Login
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const accessToken = generateAccessToken({ username: user.username });
        const refreshToken = generateRefreshToken({ username: user.username });

        user.refreshToken = refreshToken;
        await user.save();
        const expiresIn = config.expiresIn;

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            path: '/'
        });

        res.json({ accessToken, refreshToken, expiresIn });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Refresh Token
exports.refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token is missing' });
    }

    try {
        const user = await User.findOne({ refreshToken });
        if (!user) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid or expired refresh token' });
            }

            const accessToken = generateAccessToken({ username: user.username });
            res.json({ accessToken });
        });

    } catch (error) {
        console.error('Error refreshing token:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
