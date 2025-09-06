import React from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import DeleteButton from './DeleteButton';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { groupByWeek,formatDate, totalHours } from '@/helper.js';

const TimeList = ({ timeEntries, setTimeEntries }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Delete entry
  const timeDelete = async (id) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/timedelete`, { data: { id } });
      if (response.data.success) {
        setTimeEntries(prev => prev.filter(entry => entry._id !== id));
        toast.success("Successfully Deleted");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete entry");
    }
  };

  const weeks = groupByWeek(timeEntries);

  return (
    <div className="mx-auto space-y-8">
      {Object.keys(weeks).map(weekNumber => (
        <div key={weekNumber}>
          <h3 className="font-bold mb-2 text-lg">Week {weekNumber}</h3>

          {/* Desktop Table */}
          <div className="hidden md:table w-full border-2 border-black">
            <Table>
              <TableHeader>
                <TableRow className="border-b-2">
                  <TableHead className="pl-2 py-4 font-semibold">Date</TableHead>
                  <TableHead className="pl-2 py-4 font-semibold">Time In</TableHead>
                  <TableHead className="pl-2 py-4 font-semibold">Time Out</TableHead>
                  <TableHead className="pl-2 py-4 font-semibold">Total Hours</TableHead>
                  <TableHead className="pl-2 py-4 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {weeks[weekNumber].map(entry => (
                  <TableRow key={entry._id} className="odd:bg-white even:bg-gray-100">
                    <TableCell className="pl-2 py-2 text-center">{formatDate(entry.newDate)}</TableCell>
                    <TableCell className="pl-2 py-2 text-center">{entry.timeIn}</TableCell>
                    <TableCell className="pl-2 py-2 text-center">{entry.timeOut}</TableCell>
                    <TableCell className="pl-2 py-2 text-center">{entry.totalHour}</TableCell>
                    <TableCell className="pl-2 py-2 text-center">
                      <DeleteButton id={entry._id} onDelete={timeDelete} />
                    </TableCell>
                  </TableRow>
                ))}

                {/* Weekly total */}
                <TableRow className="border-t font-semibold">
                  <TableCell colSpan={3} className="pl-2 py-2 text-right">Total Time This Week:</TableCell>
                  <TableCell className="pl-2 py-2 text-center">{totalHours(weeks[weekNumber])}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Mobile Stacked Table */}
          <div className="md:hidden space-y-4">
            {weeks[weekNumber].map(entry => (
              <div key={entry._id} className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex justify-end mb-2">
                  <DeleteButton id={entry._id} onDelete={timeDelete} />
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Date:</span>
                  <span>{formatDate(entry.newDate)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Time In:</span>
                  <span>{entry.timeIn}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Time Out:</span>
                  <span>{entry.timeOut}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Total Hours:</span>
                  <span>{entry.totalHour}</span>
                </div>
              </div>
            ))}

            {/* Weekly total for mobile */}
            <div className="bg-gray-100 p-2 font-semibold text-center rounded">
              Total Time This Week: {totalHours(weeks[weekNumber])}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimeList;
