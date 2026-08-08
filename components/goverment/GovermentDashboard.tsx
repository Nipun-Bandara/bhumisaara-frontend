"use client";

import { useMemo } from "react";
import MintBatchForm from "./MintBatchForm";
import TxHashBadge from "./TxHashBadge";
import { useMintedBatches } from "@/hooks/use-minted-batches";
import {
  Download,
  Truck,
  TrendingUp,
  CheckCircle,
  Flame,
  Building2,
  ArrowRight,
  Coins
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";

export default function GovermentDashboard() {
  const router = useRouter();

  const { isNFTsLoading, records } = useMintedBatches();

  const totalImportedTons = useMemo(() => {
    const totalKg = records.reduce((sum, record) => sum + Number(record.supply || 0), 0);
    return (totalKg / 1000).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 });
  }, [records]);

  const activeTokensMinted = records.length;
  const totalBurns = 0; // We will update this once the burning flow is implemented

  return (
    <div className="flex flex-col min-h-full w-full bg-background">
      <main className="flex-grow px-4 md:px-8 max-w-8xl mx-auto w-full pb-8 space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-primary">Dashboard Overview</h1>
            <p className="text-lg text-muted-foreground">
              Real-time national grid agrarian metrics.
            </p>
          </div>
          <Button variant="outline" className="hidden sm:flex items-center gap-2 shadow-sm">
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </div>

        {/* Top KPI Metrics Ribbon */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-secondary rounded-lg text-secondary-foreground">
                <Truck className="w-6 h-6" />
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                <CheckCircle className="w-4 h-4" />
                Live
              </span>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Imported (Tons)</p>
            <h3 className="text-4xl font-bold text-foreground group-hover:text-primary transition-colors">{totalImportedTons}</h3>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-primary/20 rounded-lg text-primary">
                <Coins className="w-6 h-6" />
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                <CheckCircle className="w-4 h-4" />
                Live
              </span>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Active Batches Minted</p>
            <h3 className="text-4xl font-bold text-foreground group-hover:text-primary transition-colors">{activeTokensMinted}</h3>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-destructive/20 rounded-lg text-destructive">
                <Flame className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Decentralized Burns</p>
            <h3 className="text-4xl font-bold text-foreground group-hover:text-primary transition-colors">{totalBurns}</h3>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-accent rounded-lg text-accent-foreground">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                <TrendingUp className="w-4 h-4" />
                +12
              </span>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Active Agrarian Centers</p>
            <h3 className="text-4xl font-bold text-foreground group-hover:text-primary transition-colors">342</h3>
          </div>
        </section>

        {/* Main Actions & Ledger Layout (Bento Grid Style) */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Main Actions Panel */}
          <div className="xl:col-span-1">
            <MintBatchForm />
          </div>

          {/* Global Live Ledger Table */}
          <div className="xl:col-span-2 bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </div>
                <h3 className="text-xl font-semibold text-foreground">Global Live Ledger</h3>
              </div>
              <Button 
                variant="ghost" 
                className="text-primary hover:text-primary/80 hover:bg-primary/10 gap-2"
                onClick={() => router.push("/import-history")}
              >
                Full History <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="overflow-x-auto flex-1">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="border-border">
                    <TableHead className="font-semibold text-muted-foreground py-4 px-6">Batch ID</TableHead>
                    <TableHead className="font-semibold text-muted-foreground py-4 px-6">Token ID</TableHead>
                    <TableHead className="font-semibold text-muted-foreground py-4 px-6 text-right">Supply Level</TableHead>
                    <TableHead className="font-semibold text-muted-foreground py-4 px-6">Current Custodian</TableHead>
                    <TableHead className="font-semibold text-muted-foreground py-4 px-6 text-center">Tx Hash</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-border/50">
                  
                  {isNFTsLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Loading blockchain ledger...
                      </TableCell>
                    </TableRow>
                  ) : records.length > 0 ? (
                    records.map((record) => (
                      <TableRow key={record.tokenId.toString()} className="hover:bg-muted/30 transition-colors duration-200 cursor-default group border-border">
                        <TableCell className="py-4 px-6">
                          <span className="font-mono text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20 text-sm">
                            {record.name}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 px-6 font-mono text-muted-foreground text-sm">
                          TK-{record.tokenId.toString()}
                        </TableCell>
                        <TableCell className="py-4 px-6 text-right font-medium text-foreground">
                          {record.supply.toString()} kg
                        </TableCell>
                        <TableCell className="py-4 px-6 text-foreground">
                          Government Reserve
                        </TableCell>
                        <TableCell className="py-4 px-6 text-center">
                          <TxHashBadge transactionHash={record.transactionHash} groupHover />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No batches minted yet.
                      </TableCell>
                    </TableRow>
                  )}
                  
                </TableBody>
              </Table>
            </div>
          </div>
          
        </section>
        
      </main>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
