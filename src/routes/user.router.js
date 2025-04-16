const userRouter = require('express').Router();
const userController = require('../controllers/user.controller');

userRouter.post('/sing_up', userController.addNewUser)
    .post('/login', userController.logUser)
;

module.exports = userRouter;