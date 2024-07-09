const multer = require('multer');

const upload = multer({
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg'
        ) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, JPG files are allowed.'));
        }
    }
});

module.exports = upload;
