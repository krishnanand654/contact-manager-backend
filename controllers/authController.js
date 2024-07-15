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



// User Registration
exports.register = async (req, res) => {

    try {
        const newUser = await User.create(req.body);

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
        if (error.code === 11000 && error.keyPattern.email) {
            res.status(400).json({ message: 'Email already exists' });
        } else {
            res.status(400).json({ message: 'Error registering user', error });
        }
    }
};

// User Login
exports.login = async (req, res) => {
    const { email, password } = req.body;



    if (!email || !password) {
        return res.send("Email and Password fields are required")
    }

    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const accessToken = generateAccessToken({ user_id: user._id });
        const refreshToken = generateRefreshToken({ user_id: user._id });

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

        jwt.verify(refreshToken, config.refreshSecretKey, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid or expired refresh token' });
            }

            const accessToken = generateAccessToken({ user_id: user._id });
            res.json({ accessToken });
        });

    } catch (error) {
        console.error('Error refreshing token:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


