"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDateTime } from "@/utils/formatters";
import { useAuditLogs } from "@/hooks/use-admin";
import { AUDIT_ACTIONS, auditActionTone, formatAuditAction } from "@/lib/admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { TableEmptyState, TableErrorState, TableSkeletonRows } from "@/components/ui/table-states";
import { ArrowLeft, ArrowRight, ScrollText } from "lucide-react";

const ANY = "__any__";
const COLUMNS = 5;
const PAGE_SIZE = 25;

/**
 * The append-only administrative trail.
 *
 * Read-only, and not because the screen was left unfinished: rows are written
 * inside the transaction of the action they describe, and no endpoint exists
 * to edit or remove one. An audit log an administrator can rewrite records
 * nothing.
 */
export default function AdminAuditLog() {
  const [action, setAction] = useState<string>(ANY);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(0);

  const logsQuery = useAuditLogs({
    action: action === ANY ? null : action,
    from: from || undefined,
    to: to || undefined,
    page,
    size: PAGE_SIZE,
  });

  const entries = logsQuery.data?.content ?? [];
  const totalPages = logsQuery.data?.totalPages ?? 0;
  const totalElements = logsQuery.data?.totalElements ?? 0;
  const currentPage = logsQuery.data?.page ?? 0;

  /** Any filter change invalidates the current page number. */
  const withReset = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(0);
  };

  return (
    <div className="flex flex-col min-h-full w-full bg-background">
      <main className="flex-grow px-4 md:px-8 max-w-7xl mx-auto w-full pb-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Audit Log</h1>
            <p className="text-lg text-muted-foreground mt-1">
              Every privileged action taken on this platform, newest first.
            </p>
          </div>
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            <ScrollText className="w-4 h-4" />
            {totalElements.toLocaleString()} entries
          </Badge>
        </div>

        {/* ─── Filters ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="actionFilter" className="text-sm font-medium text-muted-foreground">
              Action
            </label>
            <Select
              value={action}
              onValueChange={withReset((value: unknown) => setAction(String(value ?? ANY)))}
            >
              <SelectTrigger id="actionFilter" className="w-full h-11 bg-background">
                <SelectValue>
                  {(value) =>
                    String(value ?? ANY) === ANY ? "Any action" : formatAuditAction(String(value))
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Any action</SelectItem>
                {AUDIT_ACTIONS.map((item) => (
                  <SelectItem key={item} value={item}>
                    {formatAuditAction(item)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="fromDate" className="text-sm font-medium text-muted-foreground">
              From
            </label>
            <Input
              id="fromDate"
              type="date"
              value={from}
              onChange={(event) => withReset(setFrom)(event.target.value)}
              className="h-11"
              max={to || undefined}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="toDate" className="text-sm font-medium text-muted-foreground">
              To
            </label>
            <Input
              id="toDate"
              type="date"
              value={to}
              onChange={(event) => withReset(setTo)(event.target.value)}
              className="h-11"
              min={from || undefined}
            />
          </div>
        </div>

        {/* ─── Trail ──────────────────────────────────────────────────── */}
        <div className="bg-card rounded-xl ring-1 ring-foreground/10 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="border-border">
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">When</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">Actor</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">Action</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">Target</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logsQuery.error ? (
                  <TableErrorState
                    columns={COLUMNS}
                    message={logsQuery.error}
                    onRetry={() => logsQuery.refetch()}
                  />
                ) : logsQuery.isLoading ? (
                  <TableSkeletonRows columns={COLUMNS} />
                ) : entries.length === 0 ? (
                  <TableEmptyState
                    columns={COLUMNS}
                    icon={ScrollText}
                    title="Nothing recorded yet"
                    description={
                      action === ANY && !from && !to
                        ? "Bans, role changes, area edits and wallet clears are written here as they happen."
                        : "No entries match these filters."
                    }
                  />
                ) : (
                  entries.map((entry) => (
                    <TableRow
                      key={entry.logId}
                      className="border-border hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="py-4 px-6 text-muted-foreground whitespace-nowrap">
                        {formatDateTime(entry.createdAt)}
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <Link
                          href={`/admin/users/${entry.actorUserId}`}
                          className="font-medium text-foreground hover:text-primary transition-colors"
                        >
                          {entry.actorUsername ?? `#${entry.actorUserId}`}
                        </Link>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <Badge variant={auditActionTone(entry.action)}>
                          {formatAuditAction(entry.action)}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        {entry.targetUserId ? (
                          <Link
                            href={`/admin/users/${entry.targetUserId}`}
                            className="text-foreground hover:text-primary transition-colors"
                          >
                            {entry.targetUsername ?? `#${entry.targetUserId}`}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">{entry.targetEntity ?? "—"}</span>
                        )}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-muted-foreground max-w-md">
                        {entry.details ?? "—"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Page {currentPage + 1} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 0}
                  onClick={() => setPage(currentPage - 1)}
                >
                  <ArrowLeft />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage + 1 >= totalPages}
                  onClick={() => setPage(currentPage + 1)}
                >
                  Next
                  <ArrowRight />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
