import express from 'express';
import { DivisionControllers } from './division.controller';

const router = express.Router();

router.route('/').get(DivisionControllers.getAllDivisions);

export const DivisionRoutes = router;
