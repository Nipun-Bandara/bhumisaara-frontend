"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { isAxiosError } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import apiPaths from "@/utils/apiPaths";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle, Clock, Flag, Plus } from "lucide-react";
import { toast } from "sonner";
import RequestStatusBadge from "@/components/RequestStatusBadge";
import TxHashBadge from "@/components/goverment/TxHashBadge";
import { useFarmerCollections } from "@/hooks/use-farmer-collections";
import type { FertilizerRequest } from "@/lib/fertilizerRequests";

const describeError = (error: unknown, fallback: string) => {
  if (isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
};

const formatDate = (value: string | null) =>
  value ? new Date(value).toLocaleDateString(undefined, { dateStyle: "medium" }) : "—";

export default function ApplicationsHistory() {
  const [requests, setRequests] = useState<FertilizerRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const {
    collections,
    isLoading: isCollectionsLoading,
    loadError: collectionsError,
    refetch: refetchCollections,
  } = useFarmerCollections();

  const [disputingId, setDisputingId] = useState<number | null>(null);

  const loadRequests = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const response = await axiosInstance.get<FertilizerRequest[]>(
        apiPaths.fertilizerRequests.mine
      );
      setRequests(response.data || []);
    } catch (error) {
      setLoadError(describeError(error, "Could not load your applications."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const pendingCount = useMemo(
    () => requests.filter((request) => request.status === "PENDING").length,
    [requests]
  );

  /**
   * Flags a handover the farmer says never reached them. Nothing is reversed —
   * the tokens are already burned — so this raises it for investigation.
   */
  const handleDispute = async (distributionId: number) => {
    setDisputingId(distributionId);
    const toastId = toast.loading("Raising a dispute...");

    try {
      await axiosInstance.post(apiPaths.distributions.dispute(distributionId));
      await refetchCollections();

      toast.dismiss(toastId);
      toast.success("Dispute raised.", {
        description: "This collection is flagged for your agrarian officer to review.",
        icon: <Flag className="w-5 h-5 text-destructive" />,
      });
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Could not raise the dispute.", {
        description: describeError(error, "Please check server connection."),
      });
    } finally {
      setDisputingId(null);
    }
  };

  return (
    <div className="flex flex-col min-h-full w-full bg-background">
      <main className="flex-grow pt-4 px-4 md:px-8 max-w-7xl mx-auto w-full pb-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Application History</h1>
            <p className="text-lg text-muted-foreground mt-1">
              Every fertilizer subsidy application you have submitted, newest first.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {pendingCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-400 text-sm font-medium rounded-full w-fit">
                <Clock className="w-4 h-4" />
                {pendingCount} awaiting review
              </div>
            )}
            <Link
              href="/application-form"
              className={cn(buttonVariants({ variant: "default" }), "w-fit h-10 px-4 gap-2")}
            >
              <Plus className="w-4 h-4" />
              New application
            </Link>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">My Applications</h2>
            <Button variant="outline" size="sm" onClick={loadRequests} disabled={isLoading}>
              Refresh
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="border-border">
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">Submitted</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">Season</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">Fertilizer</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">Requested</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">Approved</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">Reviewed By</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">Reviewed On</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadError ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <p className="text-destructive mb-3">{loadError}</p>
                      <Button variant="outline" size="sm" onClick={loadRequests}>
                        Retry
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      Loading your applications...
                    </TableCell>
                  </TableRow>
                ) : requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      No applications yet — submit one from the application form.
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((request) => (
                    <TableRow
                      key={request.requestId}
                      className="border-border hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="py-4 px-6 text-muted-foreground">
                        {formatDate(request.createdAt)}
                      </TableCell>
                      <TableCell className="py-4 px-6">{request.season}</TableCell>
                      <TableCell className="py-4 px-6">{request.fertilizerType}</TableCell>
                      <TableCell className="py-4 px-6">{request.requestedKg}kg</TableCell>
                      <TableCell className="py-4 px-6 font-medium text-foreground">
                        {request.approvedKg != null ? `${request.approvedKg}kg` : "—"}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-muted-foreground">
                        {request.reviewedByOfficerUsername ?? "—"}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-muted-foreground">
                        {formatDate(request.reviewedAt)}
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <RequestStatusBadge status={request.status} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Collections — what was physically handed over, proven by a token burn */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">My Collections</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Every handover recorded against your name, with the sacks you received.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refetchCollections}
              disabled={isCollectionsLoading}
            >
              Refresh
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="border-border">
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">Collected</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">Fertilizer</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">Amount</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">Sack Serials</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">Officer</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6 text-center">Burn Tx</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6 text-right">Dispute</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collectionsError ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <p className="text-destructive mb-3">{collectionsError}</p>
                      <Button variant="outline" size="sm" onClick={refetchCollections}>
                        Retry
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : isCollectionsLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      Loading your collections...
                    </TableCell>
                  </TableRow>
                ) : collections.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      Nothing collected yet — your officer records a handover when you pick your
                      fertilizer up.
                    </TableCell>
                  </TableRow>
                ) : (
                  collections.map((collection) => (
                    <TableRow
                      key={collection.distributionId}
                      className={`border-border transition-colors group ${
                        collection.disputed ? "bg-destructive/5 hover:bg-destructive/10" : "hover:bg-muted/30"
                      }`}
                    >
                      <TableCell className="py-4 px-6 text-muted-foreground">
                        {formatDate(collection.createdAt)}
                      </TableCell>
                      <TableCell className="py-4 px-6">{collection.fertilizerType ?? "—"}</TableCell>
                      <TableCell className="py-4 px-6 font-medium text-foreground">
                        {collection.amountDispensedKg}kg
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {collection.sackSerials.length === 0 ? (
                            <span className="text-muted-foreground">—</span>
                          ) : (
                            collection.sackSerials.map((serial) => (
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
                      <TableCell className="py-4 px-6 text-muted-foreground">
                        {collection.officerName ?? "—"}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-center">
                        <TxHashBadge transactionHash={collection.burnTransactionHash} groupHover />
                      </TableCell>
                      <TableCell className="py-4 px-6 text-right">
                        {collection.disputed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-900 dark:bg-red-500/20 dark:text-red-400">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Disputed
                          </span>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={disputingId === collection.distributionId}
                            onClick={() => handleDispute(collection.distributionId)}
                            className="text-destructive border-destructive/40 hover:bg-destructive/10 cursor-pointer"
                          >
                            I did not receive this
                          </Button>
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
