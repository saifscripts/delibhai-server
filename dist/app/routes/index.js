"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/auth/auth.route");
const district_route_1 = require("../modules/district/district.route");
const division_route_1 = require("../modules/division/division.route");
const rider_route_1 = require("../modules/rider/rider.route");
const union_route_1 = require("../modules/union/union.route");
const upazila_route_1 = require("../modules/upazila/upazila.route");
const user_route_1 = require("../modules/user/user.route");
const village_route_1 = require("../modules/village/village.route");
const router = express_1.default.Router();
const routes = [
    { path: '/auth', route: auth_route_1.AuthRoutes },
    { path: '/user', route: user_route_1.UserRoutes },
    { path: '/rider', route: rider_route_1.RiderRoutes },
    { path: '/division', route: division_route_1.DivisionRoutes },
    { path: '/district', route: district_route_1.DistrictRoutes },
    { path: '/upazila', route: upazila_route_1.UpazilaRoutes },
    { path: '/union', route: union_route_1.UnionRoutes },
    { path: '/village', route: village_route_1.VillageRoutes },
];
routes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
