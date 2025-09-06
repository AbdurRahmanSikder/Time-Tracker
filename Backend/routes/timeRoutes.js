import express from "express";
import { TimeSave , TimeList, TimeDelete } from "../controller/TimeController.js";
const TimeRouter = express();

TimeRouter.post("/time" , TimeSave);
TimeRouter.delete("/timedelete" , TimeDelete);
TimeRouter.get("/timelist" , TimeList);

export default TimeRouter;