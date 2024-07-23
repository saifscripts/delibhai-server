const express = require('express');
const divisionControllers = require('../../controllers/division.controller');

const router = express.Router();

router.get('/all', divisionControllers.getAllDivision);

module.exports = router;
