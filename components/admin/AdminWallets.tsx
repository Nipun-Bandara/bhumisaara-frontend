"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import axiosInstance from "@/utils/axiosInstance";
import apiPaths from "@/utils/apiPaths";
import { describeApiError } from "@/utils/apiError";
import { useAdminWallets } from "@/hooks/use-admin";
import { formatRole } from "@/lib/admin";
import type { AdminWalletStatus } from "@/lib/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableEmptyState, TableErrorState, TableSkeletonRows } from "@/components/ui/table-states";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { AlertTriangle, CheckCircle, Unlink, Wallet } from "lucide-react";

const COLUMNS = 6;

/**
 * Wallet oversight.
 *
 * The backend holds no web3 client — every mint, transfer and burn is signed
 * in the browser and only *recorded* server-side — so an unlinked wallet on a
 * government admin or an officer is not untidiness, it is a dead end in the
 * token chain that fails silently. Those two roles are flagged as blocking;
 * a farmer or seller without one has simply not connected yet.
 *
 * The only wallet action here is *clearing* a link. There is deliberately no
 * way to set an address: an operator who could write that field could point a
 * mint or a farmer's credits at a wallet of their own, and the on-chain record
 * would look entirely legitimate.
 */
export default function AdminWallets() {
  const [unlinkedOnly, setUnlinkedOnly] = useState(false);
  const [clearTarget, setClearTarget] = useState<AdminWalletStatus | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const walletsQuery = useAdminWallets(unlinkedOnly);
  const wallets = walletsQuery.data;

  const blockingCount = wallets.filter((entry) => entry.blocking).length;
  const linkedCount = wallets.filter((entry) => entry.walletLinked).length;

  const handleClearConfirm = async () => {
    if (!clearTarget) return;

    setIsSaving(true);
    const toastId = toast.loading("Clearing wallet...");

    try {
      await axiosInstance.delete(apiPaths.admin.wallet(clearTarget.userId));
      await walletsQuery.refetch();

      toast.dismiss(toastId);
      toast.success(`${clearTarget.username}'s wallet has been unlinked.`, {
        description: "They must connect and sign with a wallet themselves to relink.",
      });
      setClearTarget(null);
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Could not clear the wallet.", {
        description: describeApiError(error, "Please check the server connection."),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full w-full bg-background">
      <main className="flex-grow px-4 md:px-8 max-w-7xl mx-auto w-full pb-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Wallet Oversight</h1>
            <p className="text-lg text-muted-foreground mt-1">
              Who can transact on-chain, and who is silently unable to.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={unlinkedOnly ? "outline" : "default"}
              size="lg"
              onClick={() => setUnlinkedOnly(false)}
            >
              All accounts
            </Button>
            <Button
              variant={unlinkedOnly ? "default" : "outline"}
              size="lg"
              onClick={() => setUnlinkedOnly(true)}
            >
              Unlinked only
            </Button>
          </div>
        </div>

        {blockingCount > 0 && (
          <Card className="ring-destructive/40 bg-destructive/5">
            <CardContent className="flex items-start gap-3 py-2">
              <div className="p-2 rounded-full bg-destructive/10 text-destructive shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-destructive">
                  {blockingCount} account(s) cannot transact
                </p>
                <p className="text-sm text-muted-foreground max-w-3xl">
                  Government admins and agrarian service officers sign on-chain transactions from
                  their own wallet. Without one, the ministry cannot mint a batch or issue credits,
                  and no stock can be transferred to that officer&apos;s area — the flow fails with
                  nothing to show for it. Ask them to connect a wallet from their profile.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="bg-card rounded-xl ring-1 ring-foreground/10 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold text-foreground">
                {unlinkedOnly ? "Accounts with no wallet" : "All accounts"}
              </h2>
            </div>
            {!walletsQuery.isLoading && !walletsQuery.error && (
              <Badge variant="secondary">
                {linkedCount} of {wallets.length} linked
              </Badge>
            )}
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="border-border">
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">User</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">Email</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">Role</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">Area</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">Wallet</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {walletsQuery.error ? (
                  <TableErrorState
                    columns={COLUMNS}
                    message={walletsQuery.error}
                    onRetry={() => walletsQuery.refetch()}
                  />
                ) : walletsQuery.isLoading ? (
                  <TableSkeletonRows columns={COLUMNS} />
                ) : wallets.length === 0 ? (
                  <TableEmptyState
                    columns={COLUMNS}
                    icon={CheckCircle}
                    title={unlinkedOnly ? "Every account has a wallet" : "No accounts yet"}
                    description={
                      unlinkedOnly
                        ? "Nothing is blocked on a missing wallet link."
                        : "Accounts appear here as soon as anyone registers."
                    }
                  />
                ) : (
                  wallets.map((entry) => (
                    <TableRow
                      key={entry.userId}
                      className={`border-border hover:bg-muted/30 transition-colors ${
                        entry.blocking ? "bg-destructive/5" : ""
                      }`}
                    >
                      <TableCell className="py-4 px-6">
                        <Link
                          href={`/admin/users/${entry.userId}`}
                          className="font-medium text-foreground hover:text-primary transition-colors"
                        >
                          {entry.username}
                        </Link>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-muted-foreground">{entry.email}</TableCell>
                      <TableCell className="py-4 px-6">
                        <Badge variant="outline">{formatRole(entry.role)}</Badge>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-muted-foreground">
                        {entry.areaName ?? "—"}
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        {entry.walletLinked ? (
                          <span className="font-mono text-xs text-muted-foreground">
                            {entry.walletAddressTruncated}
                          </span>
                        ) : entry.blocking ? (
                          <Badge variant="destructive">
                            <AlertTriangle />
                            Blocking — cannot transact
                          </Badge>
                        ) : (
                          <Badge variant="muted">Not connected</Badge>
                        )}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={!entry.walletLinked}
                          onClick={() => setClearTarget(entry)}
                        >
                          <Unlink />
                          Clear
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <p className="text-xs text-muted-foreground max-w-3xl">
          An operator can unlink a wallet but never set one. Writing an address would let an
          administrator redirect a mint, a stock transfer or a farmer&apos;s credits to a wallet of
          their choosing, and every on-chain record would look legitimate. Clearing grants nothing:
          the user has to connect and sign with the new wallet themselves, which proves they hold
          its key.
        </p>
      </main>

      <ConfirmDialog
        open={clearTarget !== null}
        onOpenChange={(open) => !open && setClearTarget(null)}
        destructive
        title="Clear this wallet link?"
        description={
          clearTarget ? (
            <>
              <strong className="text-foreground">{clearTarget.username}</strong>&apos;s wallet{" "}
              <span className="font-mono">{clearTarget.walletAddressTruncated}</span> will be
              unlinked from their account. Tokens already in that wallet stay on-chain and are
              unaffected — only the recorded address is removed, so they can connect a new one.
              {clearTarget.role === "AGRARIAN_SERVICE_OFFICER" && (
                <> Until they relink, no stock can be transferred to their area.</>
              )}
              {clearTarget.role === "GOVERNMENT_ADMIN" && (
                <> Until they relink, they cannot mint a batch or issue credits.</>
              )}
            </>
          ) : null
        }
        confirmLabel="Clear wallet"
        pendingLabel="Clearing..."
        isPending={isSaving}
        onConfirm={handleClearConfirm}
      />
    </div>
  );
}
