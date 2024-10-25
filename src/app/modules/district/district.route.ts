import express from 'express';
import { DistrictControllers } from './district.controller';

const router = express.Router();

router.route('/:divisionId').get(DistrictControllers.getDistricts);

export const DistrictRoutes = router;
