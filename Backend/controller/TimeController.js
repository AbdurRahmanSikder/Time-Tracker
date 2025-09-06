import TimeSchema from "../models/TimeEntry.js";

export const TimeSave = async (req, res) => {

    try {
        const { newDate, timeIn, timeOut, totalHour } = req.body;
        if (!newDate || !timeIn || !timeOut || !totalHour)
            return res.json({ success: false, message: "Missind details" });
        const response = await TimeSchema.create({ newDate, timeIn, timeOut, totalHour });

        return res.json({ success: true, message: "Time entry saved", response });

    }
    catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Server error" });
    }


}

export const TimeList = async (req, res) => {
    try {
        const response = await TimeSchema.find().sort({ newDate: 1 });
        return res.json({ success: true, message: "Full List", response });
    }
    catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Time List can't fetch" });
    }
}

export const TimeDelete = async (req, res) => {
    try {
        const { id } = req.body;
        const response = await TimeSchema.findByIdAndDelete(id);
        return res.json({ success: true , message : "Successfully Deleted" , response});
    }
    catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Time List can't Deleted" , error });
    }
}