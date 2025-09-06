import axios from 'axios';
import { useEffect, useState } from 'react';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { Button } from './ui/button';
import { toast } from 'sonner';
import { calculateTotal, totalHours } from '@/helper';
const TimeTable = ({ timeEntries, setTimeEntries }) => {
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
        {
          newDate: date,
          timeIn,
          timeOut,
          totalHour: totalTime
        }
      ])
      setTimeEntries(prev =>
        [...prev].sort((a, b) => new Date(a.newDate) - new Date(b.newDate))
      );

    }
    else {
      toast.success("Something went wrnog");
    }
  };

  return (
    <div className='max-w-md border-2 border-black my-8 mx-auto'>
      <Table>
        <TableBody>
          <TableRow className="text-center odd:bg-white even:bg-gray-100 text-base">
            <TableHead >Date</TableHead>
            <TableCell className="flex justify-end">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </TableCell>
          </TableRow>
          <TableRow className="text-center odd:bg-white even:bg-gray-100 text-base">
            <TableHead  >Time In</TableHead>
            <TableCell className="flex justify-end" >
              <input type="time" value={timeIn} onChange={(e) => setTimeIn(e.target.value)} />
            </TableCell>
          </TableRow>
          <TableRow className="text-center odd:bg-white even:bg-gray-100 text-base">
            <TableHead >Time Out</TableHead>
            <TableCell className="flex justify-end" >
              <input type="time" value={timeOut} onChange={(e) => setTimeOut(e.target.value)} />
            </TableCell>
          </TableRow>
          <TableRow className="text-center odd:bg-white even:bg-gray-100 text-base" >
            <TableHead >Total time</TableHead>
            <TableCell className="flex justify-end">{totalTime} hour</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div onClick={submitTime} className='w-full flex justify-center'>
        <Button className="my-4 mx-auto px-8 py-4 hover:cursor-pointer text-lg">submit</Button>
      </div>
      <hr />
      <div className='px-2 py-2'>
        Total Time in This month {totalHours(timeEntries)}
      </div>
    </div>

  );
};

export default TimeTable;
