const userRouter = require('express').Router();
const userController = require('../controllers/user.controller');
const upload = require('../middlewares/multer.middleware');

userRouter.post('/sign_up', upload.single('profileImage'),userController.addNewUser)
    .post('/login', userController.logUser);

module.exports = userRouter;