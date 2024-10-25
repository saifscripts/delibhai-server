import express from 'express';
import { UpazilaControllers } from './upazila.controller';

const router = express.Router();

router.route('/:districtId').get(UpazilaControllers.getUpazilas);

export const UpazilaRoutes = router;
