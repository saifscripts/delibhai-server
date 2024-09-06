const express = require('express');
const wardControllers = require('../../controllers/ward.controller');

const router = express.Router();

router.get('/:unionCode', wardControllers.getWardsByUnionCode);

module.exports = router;
