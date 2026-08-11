"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { isAxiosError } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import apiPaths from "@/utils/apiPaths";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, ClipboardCheck, Clock, XCircle } from "lucide-react";
import type { FertilizerRequest, RequestStatus } from "@/lib/fertilizerRequests";

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: "ALL", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "COLLECTED", label: "Collected" },
];

const describeError = (error: unknown, fallback: string) => {
  if (isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
};

const formatDate = (value: string | null) =>
  value ? new Date(value).toLocaleDateString(undefined, { dateStyle: "medium" }) : "—";

function StatusBadge({ status }: { status: RequestStatus }) {
  const styles: Record<RequestStatus, string> = {
    PENDING: "bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-400",
    APPROVED: "bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-400",
    REJECTED: "bg-red-100 text-red-900 dark:bg-red-500/20 dark:text-red-400",
    COLLECTED: "bg-primary/10 text-primary",
  };

  const icons: Record<RequestStatus, React.ReactNode> = {
    PENDING: <Clock className="w-3.5 h-3.5" />,
    APPROVED: <CheckCircle className="w-3.5 h-3.5" />,
    REJECTED: <XCircle className="w-3.5 h-3.5" />,
    COLLECTED: <CheckCircle className="w-3.5 h-3.5" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {icons[status]}
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

export default function AreaApplicationsHistory() {
  const [requests, setRequests] = useState<FertilizerRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const response = await axiosInstance.get<FertilizerRequest[]>(
        apiPaths.fertilizerRequests.area,
        // Omitting the param entirely returns every status.
        statusFilter === "ALL" ? undefined : { params: { status: statusFilter } }
      );
      setRequests(response.data || []);
    } catch (error) {
      setLoadError(describeError(error, "Could not load applications for your area."));
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const areaLabel = useMemo(() => {
    const withArea = requests.find((request) => request.areaName);
    return withArea ? `${withArea.areaName}, ${withArea.district}` : null;
  }, [requests]);

  const pendingCount = useMemo(
    () => requests.filter((request) => request.status === "PENDING").length,
    [requests]
  );

  return (
    <div className="flex flex-col min-h-full w-full bg-background">
      <main className="flex-grow pt-4 px-4 md:px-8 max-w-7xl mx-auto w-full pb-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Application History</h1>
            <p className="text-lg text-muted-foreground mt-1">
              Every fertilizer application from farmers in
              {areaLabel ? ` ${areaLabel}` : " your area"}, newest first.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {pendingCount > 0 && statusFilter !== "PENDING" && (
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-400 text-sm font-medium rounded-full w-fit">
                <Clock className="w-4 h-4" />
                {pendingCount} still pending
              </div>
            )}
            <Link
              href="/request-approvals"
              className={cn(buttonVariants({ variant: "default" }), "w-fit h-10 px-4 gap-2")}
            >
              <ClipboardCheck className="w-4 h-4" />
              Review queue
            </Link>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-foreground">Area Applications</h2>
            <div className="flex items-center gap-3">
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value ? String(value) : "ALL")}
                disabled={isLoading}
              >
                <SelectTrigger className="w-[170px] h-9 bg-background">
                  <SelectValue>
                    {(value) =>
                      STATUS_FILTERS.find((filter) => filter.value === String(value ?? ""))?.label ??
                      "All statuses"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {STATUS_FILTERS.map((filter) => (
                    <SelectItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={loadRequests} disabled={isLoading}>
                Refresh
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="border-border">
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">Submitted</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">Farmer</TableHead>
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
                    <TableCell colSpan={9} className="h-24 text-center">
                      <p className="text-destructive mb-3">{loadError}</p>
                      <Button variant="outline" size="sm" onClick={loadRequests}>
                        Retry
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                      Loading applications...
                    </TableCell>
                  </TableRow>
                ) : requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                      {statusFilter === "ALL"
                        ? "No applications from farmers in your area yet."
                        : `No ${statusFilter.toLowerCase()} applications in your area.`}
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
                      <TableCell className="py-4 px-6 font-medium text-foreground">
                        {request.farmerUsername}
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
                        <StatusBadge status={request.status} />
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
