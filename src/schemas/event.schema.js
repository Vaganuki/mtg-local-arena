const yup = require('yup');

const eventSchema = yup.object({
    name: yup.string()
        .required("Event name is required.")
        .min(1, "Event name must be at least 1 character long.")
        .max(255, "Event name cannot exceed 255 characters."),
    description: yup.string()
        .required("Description is required.")
        .min(1, "Description must be at least 1 character long.")
        .max(255, "Description cannot exceed 255 characters."),
    places_count: yup.number()
        .integer("Number of places must be an integer.")
        .positive("Number of places must be a positive number.")
        .required("Number of places is required.")
        .min(1, "At least one place is required."),
    location: yup.string()
        .required("Location is required.")
        .min(1, "Location must be at least 1 character long.")
        .max(255, "Location cannot exceed 255 characters."),
    id_format: yup.number()
        .integer("Format ID must be an integer.")
        .min(1, "Format ID must be at least 1.")
        .positive("Format ID must be a positive number.")
        .required("Format ID is required."),
    id_category: yup.number()
        .integer("Category ID must be an integer.")
        .min(1, "Category ID must be at least 1.")
        .positive("Category ID must be a positive number.")
        .required("Category ID is required."),
    annulation: yup.boolean()
        .default(false),
    date: yup.date()
        .required("Event date is required.")
        .min(new Date(), "The event date must be in the future."),
});

module.exports = eventSchema;