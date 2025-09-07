import React, { useEffect } from 'react';
import { useTimeContext } from "@/context/timeContext";

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
import { groupByWeek, formatDate, totalHours  } from '@/helper.js';

const TimeList = () => {

  // Delete entry
  const { timeEntries, timeDelete, axios } = useTimeContext();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  let weeks = groupByWeek(timeEntries);
 useEffect(()=>{
   weeks = groupByWeek(timeEntries)
 },[timeEntries])
  

  return (
    <div className="mx-auto space-y-8 max-w-5xl">
      {Object.keys(weeks).map(weekNumber => (
        <div key={weekNumber}>
          <h3 className="font-bold mb-4 text-xl text-indigo-600">Week {weekNumber}</h3>

          {/* Desktop Table */}
          <div className="hidden md:block w-full overflow-x-auto rounded-lg shadow-lg border border-gray-300">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="bg-indigo-100 border-b border-gray-300">
                  <TableHead className="pl-4 py-3 font-semibold text-gray-700">Date</TableHead>
                  <TableHead className="pl-4 py-3 font-semibold text-gray-700">Time In</TableHead>
                  <TableHead className="pl-4 py-3 font-semibold text-gray-700">Time Out</TableHead>
                  <TableHead className="pl-4 py-3 font-semibold text-gray-700">Total Hours</TableHead>
                  <TableHead className="pl-4 py-3 font-semibold text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {weeks[weekNumber].map(entry => (
                  <TableRow key={entry._id} className="odd:bg-white even:bg-gray-50 hover:bg-indigo-50 transition-colors">
                    <TableCell className="pl-4 py-2 text-center">{formatDate(entry.newDate)}</TableCell>
                    <TableCell className="pl-4 py-2 text-center">{entry.timeIn}</TableCell>
                    <TableCell className="pl-4 py-2 text-center">{entry.timeOut}</TableCell>
                    <TableCell className="pl-4 py-2 text-center font-medium text-indigo-600">{entry.totalHour}</TableCell>
                    <TableCell className="pl-4 py-2 text-center">
                      <DeleteButton id={entry._id} onDelete={timeDelete} />
                    </TableCell>
                  </TableRow>
                ))}

                {/* Weekly total */}
                <TableRow className="bg-indigo-50 border-t border-gray-300 font-semibold">
                  <TableCell colSpan={3} className="pl-4 py-2 text-right">Total Time This Week:</TableCell>
                  <TableCell className="pl-4 py-2 text-center text-indigo-700">{totalHours(weeks[weekNumber])}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Mobile Stacked Table */}
          <div className="md:hidden space-y-4">
            {weeks[weekNumber].map(entry => (
              <div key={entry._id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-end mb-2">
                  <DeleteButton id={entry._id} onDelete={timeDelete} />
                </div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-gray-700">Date:</span>
                  <span>{formatDate(entry.newDate)}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-gray-700">Time In:</span>
                  <span>{entry.timeIn}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-gray-700">Time Out:</span>
                  <span>{entry.timeOut}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-gray-700">Total Hours:</span>
                  <span className="font-medium text-indigo-600">{entry.totalHour}</span>
                </div>
              </div>
            ))}

            {/* Weekly total for mobile */}
            <div className="bg-indigo-50 p-3 font-semibold text-center rounded text-indigo-700 shadow-inner">
              Total Time This Week: {totalHours(weeks[weekNumber])}
            </div>
          </div>
        </div>
      ))}
    </div>

  );
};

export default TimeList;
