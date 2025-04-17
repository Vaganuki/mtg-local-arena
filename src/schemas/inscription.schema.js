const yup = require('yup');

const inscriptionSchema = yup.object({
    id_event: yup.number()
        .required("Event ID is required.")
        .integer("Event ID must be an integer.")
        .positive("Event ID must be a positive number."),
    id_user: yup.number()
        .required("User ID is required.")
        .integer("User ID must be an integer.")
        .positive("User ID must be a positive number."),
});

module.exports = inscriptionSchema;