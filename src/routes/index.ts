import { Router } from "express";
import { UserRoutes } from "../modules/users/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { ScheduleRoutes } from "../modules/schedules/schedule.route";
import { BookingsRoutes } from "../modules/bookings/bookings.route";
import { ServicesRoutes } from "../modules/service/service.route";
import { ServicesTypeRoutes } from "../modules/serviceType/serviceType.route";


export const router = Router();

const modules = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/service",
    route: ServicesRoutes,
  },
  {
    path: "/service-type",
    route: ServicesTypeRoutes,
  },
  {
    path: "/bookings",
    route: BookingsRoutes,
  },

];

modules.forEach((route) => {
  router.use(route.path, route.route);
});
