const express = require('express');
const upazilaControllers = require('../../controllers/upazila.controller');

const router = express.Router();

router.get('/:districtId', upazilaControllers.getUpazilas);

module.exports = router;
