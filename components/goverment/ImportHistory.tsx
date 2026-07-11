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
import { useReadContract } from "thirdweb/react";
import { getNFTs } from "thirdweb/extensions/erc1155";
import { contract } from "@/lib/contract";

type ImportRecord = {
  id: string;
  name: string;
  description: string;
  volume: string;
  status: string;
};

const columns: ColumnDef<ImportRecord>[] = [
  { accessorKey: "id", header: "Token ID" },
  { accessorKey: "name", header: "Batch Name" },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "volume", header: "Volume (KG)" },
  {
    accessorKey: "status",
    header: "Status",
    cell: () => {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-400">
          Minted on Chain
        </span>
      );
    },
  },
];

export default function ImportHistory() {
  const { data: nfts = [], isLoading } = useReadContract(getNFTs, { contract });

  const data = React.useMemo(() => {
    return nfts.map(nft => ({
      id: `TK-${nft.id.toString()}`,
      name: nft.metadata?.name || "Unknown Batch",
      description: nft.metadata?.description || "No description",
      volume: nft.supply.toString(),
      status: "Minted",
    }));
  }, [nfts]);

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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                      Loading blockchain history...
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
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
