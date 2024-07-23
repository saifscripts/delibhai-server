const express = require('express');
const districtControllers = require('../../controllers/district.controller');

const router = express.Router();

router.get('/:divisionId', districtControllers.getDistricts);

module.exports = router;
