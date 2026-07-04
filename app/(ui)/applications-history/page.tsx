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
import { Card, CardContent } from "@/components/ui/card";

type ApplicationRecord = {
  id: string;
  date: string;
  fullName: string;
  nic: string;
  landSize: number;
  cropType: string;
  fertilizerType: string;
  quantity: number;
  status: "Pending" | "Approved" | "Rejected";
};

const data: ApplicationRecord[] = [
  {
    id: "APP-2023-001",
    date: "2023-10-15",
    fullName: "Arjuna Perera",
    nic: "198012345678",
    landSize: 2.5,
    cropType: "Paddy Rice",
    fertilizerType: "Urea",
    quantity: 50,
    status: "Approved",
  },
  {
    id: "APP-2023-042",
    date: "2023-11-20",
    fullName: "Arjuna Perera",
    nic: "198012345678",
    landSize: 2.5,
    cropType: "Vegetables",
    fertilizerType: "Organic Compost",
    quantity: 100,
    status: "Pending",
  },
  {
    id: "APP-2023-088",
    date: "2023-09-10",
    fullName: "Arjuna Perera",
    nic: "198012345678",
    landSize: 2.5,
    cropType: "Maize",
    fertilizerType: "TSP",
    quantity: 25,
    status: "Rejected",
  }
];

const columns: ColumnDef<ApplicationRecord>[] = [
  {
    accessorKey: "id",
    header: "App ID",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "cropType",
    header: "Crop",
  },
  {
    accessorKey: "fertilizerType",
    header: "Fertilizer",
  },
  {
    accessorKey: "quantity",
    header: "Quantity (kg)",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      
      let colorClass = "bg-secondary text-secondary-foreground";
      if (status === "Approved") colorClass = "bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-400";
      if (status === "Rejected") colorClass = "bg-red-100 text-red-900 dark:bg-red-500/20 dark:text-red-400";
      if (status === "Pending") colorClass = "bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-400";
      
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
          {status}
        </span>
      );
    },
  },
];

export default function ApplicationsHistoryPage() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
     <div className="flex flex-col min-h-full w-full bg-background">
      <main className="flex-grow pt-4 px-4 md:px-8 max-w-7xl mx-auto w-full pb-8 space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-primary">Fertilizer Subsidy Application</h1>
          <p className="text-lg text-muted-foreground">
            Fill in the details below to apply for your seasonal fertilizer subsidy.
          </p>
        </div>
            <Table>
              <TableHeader className="bg-muted/50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-border">
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="font-semibold text-muted-foreground py-4">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="border-border hover:bg-muted/30 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-4">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No applications found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            </main>
          </div>
  );
}
