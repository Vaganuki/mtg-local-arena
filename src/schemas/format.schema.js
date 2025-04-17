const yup = require('yup');

const formatSchema = yup.object({
    name: yup.string()
        .required("Name is required.")
        .min(1, "Name must be at least 1 character long.")
        .max(255, "Name must not exceed 255 characters."),
});

module.exports = formatSchema;