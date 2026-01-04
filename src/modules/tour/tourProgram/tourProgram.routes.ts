import { Router } from "express";
import { getTourProgram } from "./tourProgram.controller";

const router: Router = Router();

router.get("/tours/:tourId/program", getTourProgram);

export default router;
