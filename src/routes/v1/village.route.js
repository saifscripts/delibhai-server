const express = require('express');
const villageControllers = require('../../controllers/village.controller');
const verifyToken = require('../../middlewares/verifyToken');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/create', verifyToken, auth('admin'), villageControllers.createVillages);
router.patch('/update/:value', verifyToken, auth('admin'), villageControllers.updateVillageByValue);
router.delete(
    '/delete/:value',
    verifyToken,
    auth('admin'),
    villageControllers.deleteVillageByValue,
);
router.get('/:unionValue', villageControllers.getVillagesByUnionValue);

module.exports = router;
