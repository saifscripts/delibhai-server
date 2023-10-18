const express = require('express');
const userControllers = require('../../controllers/user.controller');

const router = express.Router();

router.post('/signup', userControllers.signup);
router.post('/verify-otp', userControllers.verifyOTP);

router.get('/:id', userControllers.getUserById);

module.exports = router;
