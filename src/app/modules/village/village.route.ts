import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { VillageControllers } from './village.controller';
import { VillageValidations } from './village.validation';

const router = express.Router();

router
    .route('/')
    .post(
        auth(USER_ROLE.admin),
        validateRequest(VillageValidations.createVillageValidationSchema),
        VillageControllers.createVillages,
    );

router.route('/:unionId').get(VillageControllers.getVillages);

export const VillageRoutes = router;
