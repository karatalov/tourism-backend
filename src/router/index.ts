import { Router } from "express";
import authRouter from "../modules/auth/auth.routes";
import tourRouter from "../modules/tour/tour.routes";
import tourDayRouter from "../modules/tour/tourDay/tourDay.routes";
import tourDayItem from "../modules/tour/tourDayItem/tourDayItem.routes";
import carsRouter from "../modules/car/car.routes";
import reviewRoutes from "../modules/review/review.routes";
import userRoutes from "../modules/user/user.routes";
import tourProgramRouter from "../modules/tour/tourProgram/tourProgram.routes";

const globalRouter: Router = Router();

globalRouter.use("/auth", authRouter);
globalRouter.use("/tours", tourRouter);
globalRouter.use("/", tourDayRouter);
globalRouter.use("/", tourDayItem);
globalRouter.use("/", tourProgramRouter);
globalRouter.use("/cars", carsRouter);
globalRouter.use("/reviews", reviewRoutes);
globalRouter.use("/users", userRoutes);

export default globalRouter;
