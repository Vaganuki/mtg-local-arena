const userRouter = require('express').Router();
const userController = require('../controllers/user.controller');
const upload = require('../middlewares/multer.middleware');
const validationMiddleware = require("../middlewares/validation.middleware");
const userSchema = require("../schemas/user.schema");

userRouter.post('/sign_up', upload.single('profileImage'), validationMiddleware(userSchema), userController.addNewUser)
    .post('/login', userController.logUser);

module.exports = userRouter;