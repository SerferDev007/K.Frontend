import React from "react";
import {
  Table as ShadcnTable,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./table"; // your shadcn table

interface Column<T> {
  header: string;
  accessor: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
}

export const DataTable = <T,>({ data, columns }: DataTableProps<T>) => {
  return (
    <div className="border">
      <ShadcnTable className="min-w-full">
        <TableHeader>
          <TableRow className=" border-1 border-gray-300  bg-gray-200">
            {columns.map((col, idx) => (
              <TableHead key={idx} className="font-bold text-left px-4 py-2">
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow key={idx} className="border-1 border-gray-200 px-4 py-2">
              {columns.map((col, cidx) => (
                <TableCell key={cidx}>{col.accessor(row)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </ShadcnTable>
    </div>
  );
};
