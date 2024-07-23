const express = require('express');
const unionControllers = require('../../controllers/union.controller');

const router = express.Router();

router.get('/:upazilaId', unionControllers.getUnions);

module.exports = router;
