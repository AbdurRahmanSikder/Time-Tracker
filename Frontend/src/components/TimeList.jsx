import React from "react";
import { useTimeContext } from "@/context/timeContext";
import { useAuth } from "@/context/AuthContext";
import DeleteButton from "./DeleteButton";
import { PenSquare } from "lucide-react";
import {
  Table,
  TableBody,
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
  const { timeEntries, timeDelete, setEditingEntry, toast, isLoading } = useTimeContext();
  const { user } = useAuth();

  // Calculate total time for the entire month
  const monthlyTotal = totalHours(timeEntries);

  // Sort entries by date
  const sortedEntries = [...timeEntries].sort(
    (a, b) => new Date(a.newDate) - new Date(b.newDate)
  );

  return (
    <div className="w-full space-y-4">
      <p className="text-center text-2xl font-semibold hidden print:block">
        {user?.email || "User"} | Office Hours
      </p>
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
                  Office Work
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
              {isLoading ? (
                // Skeleton Rows
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`} className="animate-pulse bg-gray-50/50">
                    <TableCell className="px-4 py-3 text-center"><div className="h-5 bg-gray-200 rounded w-20 mx-auto"></div></TableCell>
                    <TableCell className="px-4 py-3 text-center"><div className="h-5 bg-gray-200 rounded w-16 mx-auto"></div></TableCell>
                    <TableCell className="px-4 py-3 text-center"><div className="h-5 bg-gray-200 rounded w-16 mx-auto"></div></TableCell>
                    <TableCell className="px-4 py-3 text-center"><div className="h-5 bg-gray-200 rounded w-12 mx-auto"></div></TableCell>
                    <TableCell className="px-4 py-3 text-center"><div className="h-5 bg-gray-200 rounded w-16 mx-auto"></div></TableCell>
                    <TableCell className="px-4 py-3 text-center print:hidden"><div className="h-5 bg-gray-200 rounded w-16 mx-auto"></div></TableCell>
                  </TableRow>
                ))
              ) : sortedEntries.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-12 text-gray-500 text-base"
                  >
                    No time entries found. Add your first entry above.
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {sortedEntries.map((entry) => (
                    <TableRow
                      key={entry.id}
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
                      <TableCell className="px-4 py-3 text-base text-gray-800 text-center">
                        {entry.officeWork ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            No
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-base font-bold text-slate-800 text-center">
                        {entry.totalHour}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center print:hidden">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => setEditingEntry(entry)}
                            className="text-blue-500 hover:text-blue-700 transition"
                            title="Edit"
                          >
                            <PenSquare size={20} />
                          </button>
                          <DeleteButton id={entry.id} onDelete={timeDelete} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* Monthly Total Row */}
                  <TableRow className="bg-slate-200 border-t-2 border-slate-400">
                    <TableCell
                      colSpan={4}
                      className="px-4 py-4 text-right font-bold text-slate-900 text-base"
                    >
                      Total Time:
                    </TableCell>
                    <TableCell className="px-4 py-4 text-base font-bold text-slate-900 text-center">
                      {monthlyTotal}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  {/* Office Work Count Row */}
                  <TableRow className="bg-slate-200 border-t border-slate-300">
                    <TableCell
                      colSpan={4}
                      className="px-4 py-4 text-right font-bold text-slate-900 text-base"
                    >
                      Total Office Work Days:
                    </TableCell>
                    <TableCell className="px-4 py-4 text-base font-bold text-slate-900 text-center">
                      {sortedEntries.filter(entry => entry.officeWork).length}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  {/* Copy Button Row */}
                  <TableRow className="bg-white border-t-0 print:hidden">
                    <TableCell colSpan={6} className="text-center py-6">
                      <button
                        onClick={() => {
                          const officeDays = sortedEntries.filter(entry => entry.officeWork).length;
                          const textToCopy = `টোটাল কর্মঘণ্টাঃ- ${monthlyTotal.replace(' hours ', ':').replace(' mins', ':00').replace(' hour ', ':').replace(' min', ':00')}\nঅফিস উপস্থিতিঃ- ${officeDays}`;
                          navigator.clipboard.writeText(textToCopy);
                          toast.success("Data copied to clipboard!");
                        }}
                        className="px-6 py-2 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors shadow-sm flex items-center gap-2 mx-auto"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                        Copy Data
                      </button>
                    </TableCell>
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