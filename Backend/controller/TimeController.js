import { AppDataSource } from "../config/db.js";
import TimeEntry from "../entities/TimeEntry.js";
import Month from "../entities/Month.js";

// Helper to find or create a Month record
const findOrCreateMonth = async (dateString, userId) => {
    const monthRepository = AppDataSource.getRepository(Month);
    const date = new Date(dateString);
    const year = date.getFullYear();
    const monthNumber = date.getMonth() + 1; // 1-12
    const monthName = date.toLocaleString('default', { month: 'short', year: 'numeric' }); // "Feb 2026"

    let monthRecord = await monthRepository.findOne({
        where: { year, monthNumber, user: { id: userId } }
    });

    if (!monthRecord) {
        monthRecord = monthRepository.create({
            name: monthName,
            year,
            monthNumber,
            user: { id: userId }
        });
        await monthRepository.save(monthRecord);
    }

    return monthRecord;
};

export const GetMonths = async (req, res) => {
    try {
        const monthRepository = AppDataSource.getRepository(Month);
        const months = await monthRepository.find({
            where: { user: { id: req.user.id } },
            order: { year: "DESC", monthNumber: "DESC" }
        });
        return res.json({ success: true, message: "Months fetched", response: months });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Could not fetch months" });
    }
};

export const TimeSave = async (req, res) => {
    try {
        const { newDate, timeIn, timeOut, totalHour, officeWork } = req.body;
        if (!newDate || !timeIn || !timeOut || !totalHour)
            return res.json({ success: false, message: "Missing details" });

        const monthRecord = await findOrCreateMonth(newDate, req.user.id);
        const timeRepository = AppDataSource.getRepository(TimeEntry);

        const newEntry = timeRepository.create({
            newDate: newDate,
            timeIn,
            timeOut,
            totalHour,
            officeWork: officeWork !== undefined ? officeWork : true,
            user: { id: req.user.id },
            month: { id: monthRecord.id }
        });

        const response = await timeRepository.save(newEntry);
        return res.json({ success: true, message: "Time entry saved", response });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Server error" });
    }
};

export const TimeList = async (req, res) => {
    try {
        const { monthId } = req.query;
        if (!monthId) return res.json({ success: false, message: "Missing month ID" });

        const timeRepository = AppDataSource.getRepository(TimeEntry);
        const response = await timeRepository.find({
            where: {
                user: { id: req.user.id },
                month: { id: Number(monthId) }
            },
            order: { newDate: "ASC" }
        });
        return res.json({ success: true, message: "Full List", response });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Time List can't fetch" });
    }
};

export const TimeUpdate = async (req, res) => {
    try {
        const { id, newDate, timeIn, timeOut, totalHour, officeWork } = req.body;
        if (!id) return res.json({ success: false, message: "Missing ID" });

        const timeRepository = AppDataSource.getRepository(TimeEntry);
        const existingEntry = await timeRepository.findOne({
            where: { id: Number(id), user: { id: req.user.id } }
        });

        if (!existingEntry) {
            return res.json({ success: false, message: "Entry not found or unauthorized" });
        }

        // Check if date changed and month needs updating
        if (newDate && newDate !== existingEntry.newDate) {
            const newMonthRecord = await findOrCreateMonth(newDate, req.user.id);
            existingEntry.month = { id: newMonthRecord.id };
            existingEntry.newDate = newDate;
        }

        existingEntry.timeIn = timeIn || existingEntry.timeIn;
        existingEntry.timeOut = timeOut || existingEntry.timeOut;
        existingEntry.totalHour = totalHour || existingEntry.totalHour;
        if (officeWork !== undefined) existingEntry.officeWork = officeWork;

        const response = await timeRepository.save(existingEntry);
        return res.json({ success: true, message: "Time entry updated", response });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Server error" });
    }
}

export const TimeDelete = async (req, res) => {
    try {
        let { id } = req.body;
        if (!id) id = req.query.id;

        const timeRepository = AppDataSource.getRepository(TimeEntry);
        const entry = await timeRepository.findOne({
            where: { id: Number(id), user: { id: req.user.id } }
        });

        if (!entry) {
            return res.json({ success: false, message: "Entry not found or unauthorized" });
        }

        const response = await timeRepository.remove(entry);
        return res.json({ success: true, message: "Successfully Deleted", response });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Time List can't Deleted", error });
    }
};

export const FullMonthTimeDelete = async (req, res) => {
    try {
        const { monthId } = req.query;
        if (!monthId) return res.json({ success: false, message: "Missing month ID" });

        const timeRepository = AppDataSource.getRepository(TimeEntry);
        await timeRepository.delete({
            user: { id: req.user.id },
            month: { id: Number(monthId) }
        });

        return res.json({ success: true, message: "Successfully Deleted month entries", response: [] });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Time List can't Deleted", error });
    }
};