const express = require('express');
const villageControllers = require('../../controllers/village.controller');

const router = express.Router();

router.get('/:unionValue', villageControllers.getVillagesByUnionValue);

module.exports = router;
