import mongoose from "mongoose";
import { Schema } from "mongoose";

const timeSchema = new Schema({
  newDate: {
    type: Date,
    require: true,
    default: ()=> {
      const today = new Date();
      return new Date(today.toISOString().split("T")[0]);
    }
  },
  timeIn: {
    type: String,
    require: true
  },
  timeOut: {
    type: String,
    require: true
  },
  totalHour: {
    type: String,
    require: true
  }
})

const TimeSchema = mongoose.model('Time' , timeSchema);

export default TimeSchema;

