const express = require('express');
const userControllers = require('../../controllers/user.controller');
const verifyToken = require('../../middlewares/verifyToken');

const router = express.Router();

router.post('/signup', userControllers.signup);
router.post('/verify-otp', userControllers.verifyOTP);
router.post('/login', userControllers.login);
router.get('/me', verifyToken, userControllers.getMe);
router.get('/heros', userControllers.getHeros);
router.get('/resend-otp/:id', userControllers.resendOTP);
router.patch('/remove-fields/:id', verifyToken, userControllers.removeUserFieldsById);

router
    .route('/location/:id')
    .get(userControllers.getUserLocationById)
    .patch(verifyToken, userControllers.updateUserLocationById);

router.route('/role').get(verifyToken, userControllers.getUserRole);

router
    .route('/:id')
    .get(userControllers.getUserById)
    .patch(verifyToken, userControllers.updateUserById);

module.exports = router;
