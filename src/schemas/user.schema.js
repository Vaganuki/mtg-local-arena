const yup = require("yup");

const userSchema = yup.object({
    username: yup.string()
        .required("Username is required.")
        .min(1, "Username must be at least 1 character long.")
        .max(255, "Username must not exceed 255 characters.")
        .matches(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens."),
    name: yup.string()
        .required("Name is required.")
        .min(1, "Name must be at least 1 character long.")
        .max(255, "Name must not exceed 255 characters."),
    email: yup.string()
        .required("Email is required.")
        .email("Invalid email address"),
    password: yup.string()
        .required("Password is required.")
        .min(8, "Password must be at least 8 character long.")
        .test('isValidPass', 'Invalid password.', (value) => {
            const hasUpperCase = /[A-Z]/.test(value);
            const hasLowerCase = /[a-z]/.test(value);
            const hasNumber = /[0-9]/.test(value);
            const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(value);
            const regexForSequentialChars = /(012|123|234|345|456|567|678|789|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i;
            const hasSequentialChars = regexForSequentialChars.test(value);
            if (hasSequentialChars) return false;
            return hasUpperCase && hasLowerCase && hasNumber && hasSymbol;
        }),
    birthdate : yup.date()
        .required("Birthdate is required.")
        .max(new Date(), "You can't be born in the future."),
});

module.exports = userSchema;