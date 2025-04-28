const fs = require("fs");

imageDelete = (path) => {
    if (path != null) {
        fs.unlinkSync(__dirname + '/../public/images/' + path);
    }
}

module.exports = imageDelete;