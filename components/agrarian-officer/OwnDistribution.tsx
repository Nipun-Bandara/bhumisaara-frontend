"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import apiPaths from "@/utils/apiPaths";
import type { DistributionRecord } from "@/lib/distribution";
import TxHashBadge from "@/components/goverment/TxHashBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Package, RefreshCw } from "lucide-react";

const describeError = (error: unknown, fallback: string) => {
  if (isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
};

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

export default function OwnDistribution() {
  const [distributions, setDistributions] = useState<DistributionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadDistributions = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const response = await axiosInstance.get<DistributionRecord[]>(apiPaths.distributions.officer);
      setDistributions(response.data || []);
    } catch (error) {
      setLoadError(describeError(error, "Could not load your distribution history."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDistributions();
  }, [loadDistributions]);

  const totals = useMemo(() => {
    const dispensedKg = distributions.reduce(
      (sum, record) => sum + Number(record.amountDispensedKg || 0),
      0
    );
    return {
      dispensedKg,
      disputedCount: distributions.filter((record) => record.disputed).length,
    };
  }, [distributions]);

  return (
    <div className="flex flex-col min-h-full w-full bg-background">
      <main className="flex-grow px-4 md:px-8 max-w-7xl mx-auto w-full pb-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Distribution History</h1>
            <p className="text-lg text-muted-foreground">
              Every fertilizer handover you have processed, newest first.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isLoading && distributions.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-secondary/30 text-secondary-foreground text-sm font-medium rounded-full border border-secondary/20 w-fit">
                <Package className="w-4 h-4" />
                {totals.dispensedKg.toLocaleString()}kg over {distributions.length}{" "}
                {distributions.length === 1 ? "handover" : "handovers"}
              </div>
            )}
            <Button
              variant="outline"
              onClick={loadDistributions}
              disabled={isLoading}
              className="flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Farmers who say a handover never reached them */}
        {!isLoading && totals.disputedCount > 0 && (
          <div className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-5 py-4 text-sm text-destructive">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {totals.disputedCount} {totals.disputedCount === 1 ? "handover is" : "handovers are"}{" "}
            disputed by the farmer — the rows in red below.
          </div>
        )}

        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="border-border">
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">Date &amp; Time</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">Farmer</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">Type</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6 text-right">Amount</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">Sack Serials</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6 text-center">Burn Tx</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadError ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <p className="text-destructive mb-3">{loadError}</p>
                      <Button variant="outline" size="sm" onClick={loadDistributions}>
                        Retry
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      Loading distribution history...
                    </TableCell>
                  </TableRow>
                ) : distributions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No handovers recorded yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  distributions.map((record) => (
                    <TableRow
                      key={record.distributionId}
                      className={`border-border transition-colors group ${
                        record.disputed ? "bg-destructive/5 hover:bg-destructive/10" : "hover:bg-muted/30"
                      }`}
                    >
                      <TableCell className="py-4 px-6 text-muted-foreground">
                        {formatDateTime(record.createdAt)}
                      </TableCell>
                      <TableCell className="py-4 px-6 font-medium text-foreground">
                        {record.farmerName ?? `Farmer #${record.farmerId}`}
                      </TableCell>
                      <TableCell className="py-4 px-6">{record.fertilizerType ?? "—"}</TableCell>
                      <TableCell className="py-4 px-6 text-right tabular-nums font-medium text-foreground">
                        {record.amountDispensedKg}kg
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {record.sackSerials.length === 0 ? (
                            <span className="text-muted-foreground">—</span>
                          ) : (
                            record.sackSerials.map((serial) => (
                              <span
                                key={serial}
                                className="font-mono text-xs bg-muted px-2 py-0.5 rounded"
                              >
                                {serial}
                              </span>
                            ))
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-center">
                        <TxHashBadge transactionHash={record.burnTransactionHash} groupHover />
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        {record.disputed ? (
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-900 dark:bg-red-500/20 dark:text-red-400"
                            title={
                              record.disputedAt
                                ? `Disputed on ${formatDateTime(record.disputedAt)}`
                                : undefined
                            }
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Disputed by farmer
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-400">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Completed
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}
