import express from "express";
import { TimeSave , TimeList, TimeDelete, FullMonthTimeDelete } from "../controller/TimeController.js";

const TimeRouter = express.Router();

TimeRouter.get("/timelist" , TimeList);
TimeRouter.post("/time" , TimeSave);
TimeRouter.delete("/timedelete" , TimeDelete);
TimeRouter.delete("/clear-time" , FullMonthTimeDelete);

export default TimeRouter;