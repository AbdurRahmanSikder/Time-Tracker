import { useEffect, useState } from "react";
import {
  convertToHour,
  countActiveDaysCurrentMonth,
  NumberOfWorkingDays,
  decimalToTime,
} from "@/helper";
import { useTimeContext } from "@/context/timeContext";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { calculateTotal, totalHours } from "@/helper";

const TimeTable = () => {
  const { timeEntries, setTimeEntries, axios, toast } = useTimeContext();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [date, setDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });
  const [timeIn, setTimeIn] = useState("00:00");
  const [timeOut, setTimeOut] = useState("00:00");
  const [totalTime, setTotalTime] = useState("00:00");
  const [showWarning, setShowWarning] = useState(false);
  const [showEmptyWarning, setShowEmptyWarning] = useState(false);

  // Calculate total hours whenever timeIn or timeOut changes
  useEffect(() => {
    setTotalTime(calculateTotal(timeIn, timeOut));
  }, [timeIn, timeOut]);

  // Check if date already exists
  const checkDuplicateDate = (dateToCheck) => {
    return timeEntries.some((entry) => {
      const entryDate = new Date(entry.newDate).toISOString().split("T")[0];
      return entryDate === dateToCheck;
    });
  };

  const submitTime = async () => {
    // Check for duplicate date
    if (checkDuplicateDate(date)) {
      setShowWarning(true);
      return;
    }

    const response = await axios.post(`${backendUrl}/api/time`, {
      newDate: date,
      timeIn,
      timeOut,
      totalHour: totalTime,
    });

    if (response.data.success) {
      toast.success("Time added");
      setTimeEntries((prev) => [...prev, response.data.response]);
      setTimeEntries((prev) =>
        [...prev].sort((a, b) => new Date(a.newDate) - new Date(b.newDate))
      );
    } else {
      toast.error("Something went wrong");
    }
  };

  const handleForceSubmit = async () => {
    const response = await axios.post(`${backendUrl}/api/time`, {
      newDate: date,
      timeIn,
      timeOut,
      totalHour: totalTime,
    });

    if (response.data.success) {
      toast.success("Time added");
      setTimeEntries((prev) => [...prev, response.data.response]);
      setTimeEntries((prev) =>
        [...prev].sort((a, b) => new Date(a.newDate) - new Date(b.newDate))
      );
      setShowWarning(false);

      // Reset form fields
      setDate(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      });
      setTimeIn("00:00");
      setTimeOut("00:00");
      setTotalTime("00:00");
    } else {
      toast.error("Something went wrong");
    }
  };

  const totalworkingHour = totalHours(timeEntries);
  const ActiveDays = countActiveDaysCurrentMonth();
  const CurrentWorkingDays = NumberOfWorkingDays(timeEntries);
  const RequireTimeRate =
    (200 - convertToHour(totalworkingHour)) /
    (ActiveDays - CurrentWorkingDays - 1);
  const CurrentTimeRate = convertToHour(totalworkingHour) / CurrentWorkingDays;

  return (
    <>
      <div className="max-w-md mx-auto my-8 bg-white border-2 border-gray-300 rounded-xl shadow-lg overflow-hidden print:hidden">
        <Table className="w-full ">
          <TableBody>
            {/* Date Row */}
            <TableRow className="text-center text-base">
              <TableHead className="py-2 px-4 font-semibold text-gray-700 bg-gray-50 rounded-tl-xl">
                Date
              </TableHead>
              <TableCell className="flex justify-end py-2 px-4 bg-gray-50 rounded-tr-xl">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </TableCell>
            </TableRow>

            {/* Time In Row */}
            <TableRow className="text-center odd:bg-gray-50 even:bg-gray-100 text-base">
              <TableHead className="py-2 px-4 font-semibold text-gray-700">
                Time In
              </TableHead>
              <TableCell className="flex justify-end py-2 px-4">
                <input
                  type="time"
                  value={timeIn}
                  onChange={(e) => setTimeIn(e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </TableCell>
            </TableRow>

            {/* Time Out Row */}
            <TableRow className="text-center odd:bg-gray-50 even:bg-gray-100 text-base">
              <TableHead className="py-2 px-4 font-semibold text-gray-700">
                Time Out
              </TableHead>
              <TableCell className="flex justify-end py-2 px-4">
                <input
                  type="time"
                  value={timeOut}
                  onChange={(e) => setTimeOut(e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </TableCell>
            </TableRow>

            {/* Total Time Row */}
            <TableRow className="text-center text-base">
              <TableHead className="py-2 px-4 font-semibold text-gray-700 bg-gray-50 rounded-bl-xl">
                Total Time
              </TableHead>
              <TableCell className="flex justify-end py-2 px-4 bg-gray-50 rounded-br-xl font-medium text-indigo-600">
                {totalTime} hour
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Submit Button */}
        <div className="w-full flex justify-center" onClick={submitTime}>
          <Button className="my-4 mx-auto px-8 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-300 text-lg shadow-md">
            Submit
          </Button>
        </div>

        <hr className="border-gray-300" />

        {/* Monthly Total */}
        <div className="px-4 py-3 text-gray-700 font-medium">
          Total Time in This Month:{" "}
          <span className="text-indigo-600">{totalworkingHour}</span>
        </div>
        <div className="px-4 py-3 text-gray-700 font-medium">
          Current duty hours per day:{" "}
          <span className="text-indigo-600">
            {decimalToTime(CurrentTimeRate)}
          </span>
        </div>
      </div>

      {/* Warning Popup Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-yellow-100 rounded-full p-2">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Duplicate Date Warning
              </h3>
            </div>

            <p className="text-gray-600 mb-6">
              An entry for{" "}
              <span className="font-semibold text-indigo-600">
                {new Date(date).toLocaleDateString("en-GB")}
              </span>{" "}
              already exists. Do you want to add another entry for this date?
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowWarning(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleForceSubmit}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Add Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty Date Warning Modal */}
      {showEmptyWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 rounded-full p-2">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Missing Date</h3>
            </div>

            <p className="text-gray-600 mb-6">
              Please enter a valid date in DD-MM-YYYY format before submitting.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowEmptyWarning(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TimeTable;
