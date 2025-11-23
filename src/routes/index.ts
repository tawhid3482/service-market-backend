import { Router } from "express";
import { UserRoutes } from "../modules/users/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { ServicesRoutes } from "../modules/service/service.route";
import { ServicesTypeRoutes } from "../modules/serviceType/serviceType.route";
import { PropertyTypeRoutes } from "../modules/propertyType/propertyType.route";
import { PropertyItemsRoutes } from "../modules/propertyItems/propertyItems.route";
import { BookingsRoutes } from "../modules/Booking/Booking.route";


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
    path: "/property-type",
    route: PropertyTypeRoutes,
  },
  {
    path: "/property-items",
    route: PropertyItemsRoutes,
  },
  {
    path: "/booking",
    route: BookingsRoutes,
  },


];

modules.forEach((route) => {
  router.use(route.path, route.route);
});
