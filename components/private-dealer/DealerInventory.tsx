"use client";

import React, { useState } from "react";
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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, PackageSearch, PackagePlus } from "lucide-react";

type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";

type InventoryItem = {
  batchId: string;
  product: string;
  supplier: string;
  category: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  registrationDate: string;
  status: StockStatus;
};

const data: InventoryItem[] = [
  {
    batchId: "BCH-2024-001",
    product: "Commercial NPK 15-15-15",
    supplier: "AgriCorp Suppliers Ltd.",
    category: "Compound",
    quantity: 450,
    unit: "MT",
    expiryDate: "Oct 2025",
    registrationDate: "2024-01-10",
    status: "In Stock",
  },
  {
    batchId: "BCH-2024-002",
    product: "Urea Prilled 46% N",
    supplier: "Global Fertilizer Co.",
    category: "Nitrogen",
    quantity: 1200,
    unit: "MT",
    expiryDate: "Jan 2026",
    registrationDate: "2024-02-15",
    status: "In Stock",
  },
  {
    batchId: "BCH-2024-003",
    product: "Triple Super Phosphate (TSP)",
    supplier: "Lanka Agri Importers",
    category: "Phosphate",
    quantity: 85,
    unit: "MT",
    expiryDate: "Mar 2025",
    registrationDate: "2024-03-01",
    status: "Low Stock",
  },
  {
    batchId: "BCH-2024-004",
    product: "Muriate of Potash (MOP)",
    supplier: "AgriCorp Suppliers Ltd.",
    category: "Potassium",
    quantity: 0,
    unit: "MT",
    expiryDate: "Jun 2025",
    registrationDate: "2024-01-25",
    status: "Out of Stock",
  },
  {
    batchId: "BCH-2024-005",
    product: "Organic Compost Mix",
    supplier: "Green Earth Organics",
    category: "Organic",
    quantity: 320,
    unit: "MT",
    expiryDate: "Dec 2025",
    registrationDate: "2024-04-05",
    status: "In Stock",
  },
];

const statusStyles: Record<StockStatus, string> = {
  "In Stock": "bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-400",
  "Low Stock": "bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-400",
  "Out of Stock": "bg-red-100 text-red-900 dark:bg-red-500/20 dark:text-red-400",
};

const columns: ColumnDef<InventoryItem>[] = [
  {
    accessorKey: "batchId",
    header: "Batch ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {row.getValue("batchId")}
      </span>
    ),
  },
  {
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => (
      <div>
        <p className="font-semibold text-foreground text-sm">{row.getValue("product")}</p>
        <p className="text-xs text-muted-foreground">{row.original.supplier}</p>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
        {row.getValue("category")}
      </span>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => (
      <span className="font-semibold text-foreground">
        {row.getValue<number>("quantity").toLocaleString()} {row.original.unit}
      </span>
    ),
  },
  {
    accessorKey: "expiryDate",
    header: "Expiry",
  },
  {
    accessorKey: "registrationDate",
    header: "Registered",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as StockStatus;
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}
        >
          {status}
        </span>
      );
    },
  },
];

export default function DealerInventory() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredData = data.filter((item) => {
    const matchesSearch =
      globalFilter === "" ||
      item.product.toLowerCase().includes(globalFilter.toLowerCase()) ||
      item.batchId.toLowerCase().includes(globalFilter.toLowerCase()) ||
      item.supplier.toLowerCase().includes(globalFilter.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Summary stats
  const totalBatches = data.length;
  const inStockCount = data.filter((d) => d.status === "In Stock").length;
  const lowStockCount = data.filter((d) => d.status === "Low Stock").length;
  const outOfStockCount = data.filter((d) => d.status === "Out of Stock").length;

  return (
    <div className="flex flex-col min-h-full w-full bg-background">
      <main className="flex-grow px-4 md:px-8 max-w-7xl mx-auto w-full space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Private Stock Inventory</h1>
            <p className="text-lg text-muted-foreground">
              View, track and manage all registered product batches.
            </p>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 py-2 px-4 border border-transparent rounded-md text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            <PackagePlus className="w-4 h-4" />
            Add Batch
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Batches", value: totalBatches, color: "text-foreground" },
            { label: "In Stock", value: inStockCount, color: "text-emerald-600 dark:text-emerald-400" },
            { label: "Low Stock", value: lowStockCount, color: "text-amber-600 dark:text-amber-400" },
            { label: "Out of Stock", value: outOfStockCount, color: "text-red-600 dark:text-red-400" },
          ].map((stat) => (
            <Card key={stat.label} className="shadow-sm border-border">
              <CardContent className="pt-5">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="shadow-sm border-border">
          <CardContent className="pt-5">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative group flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Search className="h-5 w-5" />
                </div>
                <Input
                  className="pl-10 h-10"
                  placeholder="Search by product, batch ID or supplier..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                />
              </div>
              {/* Category Filter */}
              <div className="w-full sm:w-56">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full">
                    <PackageSearch className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Compound">Compound</SelectItem>
                    <SelectItem value="Nitrogen">Nitrogen</SelectItem>
                    <SelectItem value="Phosphate">Phosphate</SelectItem>
                    <SelectItem value="Potassium">Potassium</SelectItem>
                    <SelectItem value="Organic">Organic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-border">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-semibold text-muted-foreground py-4">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-border hover:bg-muted/30 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
                  No inventory items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

      </main>
    </div>
  );
}
