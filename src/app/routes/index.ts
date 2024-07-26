import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { RiderRoutes } from '../modules/rider/rider.route';
import { UserRoutes } from '../modules/user/user.route';
import { VillageRoutes } from '../modules/village/village.route';

const router = express.Router();

const routes = [
    { path: '/auth', route: AuthRoutes },
    { path: '/user', route: UserRoutes },
    { path: '/rider', route: RiderRoutes },
    { path: '/village', route: VillageRoutes },
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
