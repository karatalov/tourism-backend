import { Router } from "express";
import {
  createTourDayItem,
  getTourDayItems,
  updateTourDayItem,
  deleteTourDayItem,
} from "./tourDayItem.controllers";

const router: Router = Router();

router.post("/days/:dayId/items", createTourDayItem);
router.get("/days/:dayId/items", getTourDayItems);
router.put("/items/:itemId", updateTourDayItem);
router.delete("/items/:itemId", deleteTourDayItem);

export default router;
