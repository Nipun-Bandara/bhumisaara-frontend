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
import { Download, Share } from "lucide-react";
import { Button } from "@/components/ui/button";

type DistributionRecord = {
  id: string;
  date: string;
  farmerName: string;
  fertilizerType: string;
  amount: number;
  txHash: string;
  status: "Completed" | "Pending";
};

const data: DistributionRecord[] = [
  {
    id: "DIST-10492",
    date: "2023-11-20 09:14 AM",
    farmerName: "Sunil Shantha",
    fertilizerType: "Urea",
    amount: 50,
    txHash: "0x8f...2c1a",
    status: "Completed",
  },
  {
    id: "DIST-10493",
    date: "2023-11-20 11:30 AM",
    farmerName: "Kamal Perera",
    fertilizerType: "NPK",
    amount: 25,
    txHash: "0x3a...9b42",
    status: "Completed",
  },
  {
    id: "DIST-10494",
    date: "2023-11-21 08:45 AM",
    farmerName: "Nimali Fernando",
    fertilizerType: "TSP",
    amount: 25,
    txHash: "Pending...",
    status: "Pending",
  }
];

const columns: ColumnDef<DistributionRecord>[] = [
  { accessorKey: "id", header: "Distribution ID" },
  { accessorKey: "date", header: "Date & Time" },
  { accessorKey: "farmerName", header: "Farmer Name" },
  { accessorKey: "fertilizerType", header: "Type" },
  { accessorKey: "amount", header: "Amount (KG)" },
  { accessorKey: "txHash", header: "Blockchain Tx" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      let colorClass = "bg-secondary text-secondary-foreground";
      if (status === "Completed") colorClass = "bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-400";
      if (status === "Pending") colorClass = "bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-400";
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
          {status}
        </span>
      );
    },
  },
];

export default function OwnDistribution() {
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
            <h1 className="text-3xl font-bold text-primary">Distribution History</h1>
            <p className="text-lg text-muted-foreground">
              Log of all fertilizer handovers processed at your center.
            </p>
          </div>
          <Button variant="outline" className="hidden sm:flex items-center gap-2 shadow-sm">
            <Download className="w-4 h-4" /> Export Log
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
                      No distributions found.
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
