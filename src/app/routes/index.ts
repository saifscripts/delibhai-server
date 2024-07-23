import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { RiderRoutes } from '../modules/rider/rider.route';

const router = express.Router();

const routes = [
    { path: '/auth', route: AuthRoutes },
    { path: '/rider', route: RiderRoutes },
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
