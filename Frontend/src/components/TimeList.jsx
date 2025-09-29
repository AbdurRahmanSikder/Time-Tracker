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
import { groupByWeek, formatDate, totalHours } from '@/helper.js';

const TimeList = () => {
  const { timeEntries, timeDelete } = useTimeContext();
  let weeks = groupByWeek(timeEntries);

  useEffect(() => {
    weeks = groupByWeek(timeEntries);
  }, [timeEntries]);

  return (
    <div className="mx-auto space-y-8 max-w-5xl">
      {Object.keys(weeks).map(weekNumber => (
        <div key={weekNumber}>
          <h3 className="font-bold mb-4 text-xl text-indigo-600">Week {weekNumber}</h3>

          {/* Unified Table (desktop + mobile) */}
          <div className="w-full overflow-x-auto rounded-lg shadow-lg border border-gray-300">
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
        </div>
      ))}
    </div>
  );
};

export default TimeList;
