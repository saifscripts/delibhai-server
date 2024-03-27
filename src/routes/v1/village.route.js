const express = require('express');
const villageControllers = require('../../controllers/village.controller');

const router = express.Router();

router.get('/:wardCode', villageControllers.getVillagesByWardCode);

module.exports = router;
