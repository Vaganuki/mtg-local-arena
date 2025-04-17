const fs = require("fs");

imageDelete = (img, path) => {
    if (img !== null) {
        fs.unlinkSync(__dirname + '/../public/images/' + path);
    }
}

module.exports = imageDelete;