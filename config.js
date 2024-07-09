require('dotenv').config();


module.exports = {
    secretKey: process.env.SECRET_KEY,
    refreshSecretKey: process.env.REFRESH_SECRECT_KEY,
    expiresIn: '10s',
    refreshExpiresIn: '60m',
    port: 3000,
    mongoURI: process.env.DB_URI
};
