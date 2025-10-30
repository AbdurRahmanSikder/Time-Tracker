import React from "react";
import { useTimeContext } from "@/context/timeContext";

import DeleteButton from "./DeleteButton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { totalHours } from "@/helper.js";

// Helper function to format date as DD-MM-YYYY
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const TimeList = () => {
  const { timeEntries, timeDelete } = useTimeContext();

  // Calculate total time for the entire month
  const monthlyTotal = totalHours(timeEntries);

  // Sort entries by date
  const sortedEntries = [...timeEntries].sort(
    (a, b) => new Date(a.newDate) - new Date(b.newDate)
  );

  return (
    <div className="w-full space-y-4">
      <p className="text-center text-2xl font-semibold hidden print:block">Abdur Rahman | Office Hours</p>
      <div className="bg-white rounded-sm overflow-hidden border border-gray-300 print:border-gray-500">
        <div className="overflow-x-auto">
          <Table className="w-full min-w-[700px]">
            <TableHeader>
              <TableRow className="bg-slate-800 hover:bg-slate-800 print:bg-amber-200">
                <TableHead className="px-4 py-3 font-bold text-white print:text-black text-center text-base">
                  Date
                </TableHead>
                <TableHead className="px-4 py-3 font-bold text-white print:text-black text-center text-base">
                  Time In
                </TableHead>
                <TableHead className="px-4 py-3 font-bold text-white print:text-black text-center text-base">
                  Time Out
                </TableHead>
                <TableHead className="px-4 py-3 font-bold text-white print:text-black text-center text-base">
                  Total Hours
                </TableHead>
                <TableHead className="px-4 py-3 font-bold text-white print:text-black text-center text-base w-32 print:hidden">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedEntries.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-12 text-gray-500 text-base"
                  >
                    No time entries found. Add your first entry above.
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {sortedEntries.map((entry) => (
                    <TableRow
                      key={entry._id}
                      className="border-b border-gray-200 hover:bg-slate-50 transition-colors"
                    >
                      <TableCell className="px-4 py-3 text-base text-gray-900 font-semibold text-center">
                        {formatDate(entry.newDate)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-base text-gray-800 text-center">
                        {entry.timeIn}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-base text-gray-800 text-center">
                        {entry.timeOut}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-base font-bold text-slate-800 text-center">
                        {entry.totalHour}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center print:hidden">
                        <DeleteButton id={entry._id} onDelete={timeDelete} />
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* Monthly Total Row */}
                  <TableRow className="bg-slate-200 border-t-2 border-slate-400">
                    <TableCell
                      colSpan={3}
                      className="px-4 py-4 text-right font-bold text-slate-900 text-base"
                    >
                      Total Time This Month:
                    </TableCell>
                    <TableCell className="px-4 py-4 text-base font-bold text-slate-900 text-center">
                      {monthlyTotal}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TimeList;