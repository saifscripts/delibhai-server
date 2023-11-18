const express = require('express');
const userControllers = require('../../controllers/user.controller');
const verifyToken = require('../../middlewares/verifyToken');

const router = express.Router();

router.post('/signup', userControllers.signup);
router.post('/verify-otp', userControllers.verifyOTP);
router.post('/login', userControllers.login);
router.get('/me', verifyToken, userControllers.getMe);
router.get('/resendOTP/:id', userControllers.resendOTP);

router.get('/:id', userControllers.getUserById);

module.exports = router;
