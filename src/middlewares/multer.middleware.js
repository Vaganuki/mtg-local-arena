const multer = require('multer');

const filter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Unauthorized file type'), false);
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.MULT_ROUTE);
    },
    filename: (req, file, cb) => {
        const suffix = file.originalname.substring(0, file.originalname.lastIndexOf('.')) + "_" + Date.now() + '_' + Math.round(Math.random() * 1E9);
        cb(null, `${suffix}.jpg`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 },
    fileFilter: filter,
});

module.exports = upload;