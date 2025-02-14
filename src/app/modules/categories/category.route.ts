import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { VillageControllers } from './category.controller';
import { VillageValidations } from './category.validation';

const router = express.Router();

router
    .route('/')
    .post(
        auth(USER_ROLE.admin),
        validateRequest(VillageValidations.createVillagesValidationSchema),
        VillageControllers.createVillages,
    );

router
    .route('/:id')
    .put(
        auth(USER_ROLE.admin),
        validateRequest(VillageValidations.updateVillageValidationSchema),
        VillageControllers.updateVillage,
    )
    .delete(auth(USER_ROLE.admin), VillageControllers.deleteVillage);

router.route('/:unionId').get(VillageControllers.getVillages);

export const VillageRoutes = router;
