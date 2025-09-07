import { useEffect, useState } from 'react';
import { convertToHour, countActiveDaysCurrentMonth} from '@/helper';
import { useTimeContext } from '@/context/timeContext';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from './ui/button';
import { calculateTotal, totalHours } from '@/helper';
const TimeTable = () => {

  const {timeEntries , setTimeEntries , axios , toast} = useTimeContext();
const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [timeIn, setTimeIn] = useState("00:00");
  const [timeOut, setTimeOut] = useState("00:00");
  const [totalTime, setTotalTime] = useState("00:00");
  // Calculate total hours whenever timeIn or timeOut changes
  useEffect(() => {
    setTotalTime(calculateTotal(timeIn, timeOut));
  }, [timeIn, timeOut]);

  const submitTime = async () => {
        const response = await axios.post(`${backendUrl}/api/time`, {
            newDate: date,
            timeIn,
            timeOut,
            totalHour: totalTime
        });
    
        if (response.data.success) {
            toast.success("Time added");
            setTimeEntries(prev => [
                ...prev,
                response.data.response
            ])
            setTimeEntries(prev =>
                [...prev].sort((a, b) => new Date(a.newDate) - new Date(b.newDate))
            );
           
        }
        else {
            toast.success("Something went wrnog");
        }
    };
  
  const totalworkingHour = totalHours(timeEntries);
  const ActiveDays = countActiveDaysCurrentMonth();
  const RequireTimeRate = (200 - (convertToHour(totalworkingHour))) /  ActiveDays.Next;
  console.log(convertToHour(ActiveDays.Current));
  const CurrentTimeRate = convertToHour(totalworkingHour) /  ActiveDays.Current;
  return (
    <div className='max-w-md mx-auto my-8 bg-white border-2 border-gray-300 rounded-xl shadow-lg overflow-hidden'>
      <Table className="w-full ">
        <TableBody>
          {/* Date Row */}
          <TableRow className="text-center text-base">
            <TableHead className="py-2 px-4 font-semibold text-gray-700 bg-gray-50 rounded-tl-xl">Date</TableHead>
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
            <TableHead className="py-2 px-4 font-semibold text-gray-700">Time In</TableHead>
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
            <TableHead className="py-2 px-4 font-semibold text-gray-700">Time Out</TableHead>
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
            <TableHead className="py-2 px-4 font-semibold text-gray-700 bg-gray-50 rounded-bl-xl">Total Time</TableHead>
            <TableCell className="flex justify-end py-2 px-4 bg-gray-50 rounded-br-xl font-medium text-indigo-600">{totalTime} hour</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Submit Button */}
      <div className='w-full flex justify-center' onClick={submitTime}>
        <Button className="my-4 mx-auto px-8 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-300 text-lg shadow-md">
          Submit
        </Button>
      </div>

      <hr className="border-gray-300" />

      {/* Monthly Total */}
      <div className='px-4 py-3 text-gray-700 font-medium'>
        Total Time in This Month: <span className="text-indigo-600">{totalworkingHour}</span>
      </div>
      <div className='px-4 py-3 text-gray-700 font-medium'>
        Require time rate: <span className="text-indigo-600">{RequireTimeRate}</span>
      </div>
      <div className='px-4 py-3 text-gray-700 font-medium'>
        Current time rate: <span className="text-indigo-600">{CurrentTimeRate}</span>
      </div>
    </div>



  );
};

export default TimeTable;
