import { Router } from "express";

import {
  createTourDay,
  getTourDays,
  updateTourDay,
  deleteTourDay,
} from "./tourDay.controllers";

const router: Router = Router();

router.post("/tours/:tourId/days", createTourDay);
router.get("/tours/:tourId/days", getTourDays);
router.put("/days/:dayId", updateTourDay);
router.delete("/days/:dayId", deleteTourDay);

export default router;
