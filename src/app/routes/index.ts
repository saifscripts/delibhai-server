import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { DistrictRoutes } from '../modules/district/district.route';
import { DivisionRoutes } from '../modules/division/division.route';
import { RiderRoutes } from '../modules/rider/rider.route';
import { UnionRoutes } from '../modules/union/union.route';
import { UpazilaRoutes } from '../modules/upazila/upazila.route';
import { UserRoutes } from '../modules/user/user.route';
import { VehicleCategoryRoutes } from '../modules/vehicle-categories/vehicle-category.route';
import { VillageRoutes } from '../modules/village/village.route';

const router = express.Router();

const routes = [
    { path: '/auth', route: AuthRoutes },
    { path: '/user', route: UserRoutes },
    { path: '/rider', route: RiderRoutes },
    { path: '/division', route: DivisionRoutes },
    { path: '/district', route: DistrictRoutes },
    { path: '/upazila', route: UpazilaRoutes },
    { path: '/union', route: UnionRoutes },
    { path: '/village', route: VillageRoutes },
    { path: '/vehicle/category', route: VehicleCategoryRoutes },
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
