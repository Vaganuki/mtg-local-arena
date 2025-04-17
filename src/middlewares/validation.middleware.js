const yup = require('yup');

const validationMiddleware = (schema) => async (req, res, next) => {
    try{
        req.body = await schema.validate(req.body, {abortEarly: false});
        next();
    } catch(err){
        if (err instanceof yup.ValidationError) {
            res.status(400).json({error: err});
        }
        else{
            res.status(500).json({error: "An unexpected error occurred."});
        }
    }
};

module.exports = validationMiddleware;