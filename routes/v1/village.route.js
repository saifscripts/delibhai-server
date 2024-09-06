const express = require('express');
const villageControllers = require('../../controllers/village.controller');
const verifyToken = require('../../middlewares/verifyToken');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/create', verifyToken, auth('admin'), villageControllers.createVillages);
router.patch('/update/:id', verifyToken, auth('admin'), villageControllers.updateVillageById);
router.delete('/delete/:id', verifyToken, auth('admin'), villageControllers.deleteVillageById);
// router.get('/title/:id', villageControllers.getVillageTitleById);
router.get('/:unionId', villageControllers.getVillagesByUnionId);

module.exports = router;
