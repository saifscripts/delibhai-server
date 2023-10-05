const express = require('express');
const userControllers = require('../../controllers/user.controller');

const verifyToken = require('../../middlewares/verifyToken');
const verifyAdmin = require('../../middlewares/verifyAdmin');

const router = express.Router();

router
  .route('/')
  .get(verifyToken, verifyAdmin, userControllers.getAllUsers)
  .post(verifyToken, verifyAdmin, userControllers.createUser)

module.exports = router;
