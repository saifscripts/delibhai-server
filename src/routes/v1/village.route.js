const express = require('express');
const villageControllers = require('../../controllers/village.controller');
const verifyToken = require('../../middlewares/verifyToken');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/:unionValue', villageControllers.getVillagesByUnionValue);
router.post('/create', verifyToken, auth('admin'), villageControllers.createVillages);

module.exports = router;
