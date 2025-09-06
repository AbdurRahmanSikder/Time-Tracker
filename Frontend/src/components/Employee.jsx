import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
const Employee = () => {
    return (
        <div className='max-w-md border-2 border-black my-8 mx-auto'>
            <Table>
                <TableBody>
                    <TableRow className="text-center odd:bg-white even:bg-gray-100 text-base">
                        <TableHead >Total time</TableHead>
                        <TableCell >
                            00
                        </TableCell>
                    </TableRow>
                    <TableRow className="text-center odd:bg-white even:bg-gray-100 text-base">
                        <TableHead  >Require Time rate</TableHead>
                        <TableCell >
                            00
                        </TableCell>
                    </TableRow>
                    <TableRow className="text-center odd:bg-white even:bg-gray-100 text-base">
                        <TableHead >Time Out</TableHead>
                        <TableCell >
                           00
                        </TableCell>
                    </TableRow>
                    <TableRow className="text-center odd:bg-white even:bg-gray-100 text-base" >
                        <TableHead >Total time</TableHead>
                        <TableCell>00</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            
        </div>
    )
}

export default Employee