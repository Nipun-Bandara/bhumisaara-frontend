"use client";

import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

type ImportRecord = {
  id: string;
  date: string;
  importer: string;
  fertilizerType: string;
  volume: number;
  status: "Cleared" | "In Transit" | "Processing";
};

const data: ImportRecord[] = [
  {
    id: "IMP-2023-091",
    date: "2023-11-20",
    importer: "Ceylon AgriCorp",
    fertilizerType: "Urea",
    volume: 50000,
    status: "Cleared",
  },
  {
    id: "IMP-2023-092",
    date: "2023-11-22",
    importer: "GlobalFert Holdings",
    fertilizerType: "TSP",
    volume: 15000,
    status: "In Transit",
  },
  {
    id: "IMP-2023-093",
    date: "2023-11-25",
    importer: "Lanka Agro Supplies",
    fertilizerType: "MOP",
    volume: 8000,
    status: "Processing",
  }
];

const columns: ColumnDef<ImportRecord>[] = [
  { accessorKey: "id", header: "Import ID" },
  { accessorKey: "date", header: "Date" },
  { accessorKey: "importer", header: "Importer" },
  { accessorKey: "fertilizerType", header: "Type" },
  { accessorKey: "volume", header: "Volume (MT)" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      let colorClass = "bg-secondary text-secondary-foreground";
      if (status === "Cleared") colorClass = "bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-400";
      if (status === "In Transit") colorClass = "bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-400";
      if (status === "Processing") colorClass = "bg-blue-100 text-blue-900 dark:bg-blue-500/20 dark:text-blue-400";
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
          {status}
        </span>
      );
    },
  },
];

export default function ImportHistory() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col min-h-full w-full bg-background">
      <main className="flex-grow px-4 md:px-8 max-w-7xl mx-auto w-full pb-8 space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-primary">National Import History</h1>
            <p className="text-lg text-muted-foreground mt">
              Log of all fertilizer shipments imported into the country.
            </p>
          </div>
          <Button variant="outline" className="hidden sm:flex items-center gap-2 shadow-sm">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
        
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-border">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="font-semibold text-muted-foreground py-4 px-6">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} className="border-border hover:bg-muted/30 transition-colors">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-4 px-6">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                      No imports found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}
