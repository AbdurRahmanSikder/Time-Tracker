import express from "express";
import { TimeSave, TimeList, TimeDelete, FullMonthTimeDelete, TimeUpdate, GetMonths } from "../controller/TimeController.js";
import { protect } from "../middleware/authMiddleware.js";

const TimeRouter = express.Router();

TimeRouter.use(protect); // Protect all time routes

TimeRouter.get("/months", GetMonths);
TimeRouter.get("/timelist", TimeList);
TimeRouter.post("/time", TimeSave);
TimeRouter.put("/update", TimeUpdate);
TimeRouter.delete("/timedelete", TimeDelete);
TimeRouter.delete("/clear-time", FullMonthTimeDelete);

export default TimeRouter;