import express from 'express';
import { UnionControllers } from './union.controller';

const router = express.Router();

router.route('/:upazilaId').get(UnionControllers.getUnions);

export const UnionRoutes = router;
