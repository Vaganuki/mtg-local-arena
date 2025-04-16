import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.MULT_ROUTE);
    },
    filename: (req, file, cb) => {
        const suffix = file.originalname.substring(file.originalname.lastIndexOf('.')) + Date.now() + '_' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}${suffix}.jpg`);
    }
});

const upload = multer({ storage, limits: { fileSize: 2 * 1024 } });

module.exports = upload;