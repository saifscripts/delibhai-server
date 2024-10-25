import express from 'express';
import { VillageControllers } from './village.controller';

const router = express.Router();

router.route('/:unionId').get(VillageControllers.getVillages);

export const VillageRoutes = router;
