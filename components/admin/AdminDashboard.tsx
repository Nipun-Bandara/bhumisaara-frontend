"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import { useSystemHealth } from "@/hooks/use-admin";
import { ALL_ROLES, formatRole } from "@/lib/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Flag,
  MapPinOff,
  ShieldCheck,
  ShoppingCart,
  UserX,
  Users,
  Wallet,
} from "lucide-react";

/**
 * The platform operator's landing screen.
 *
 * Every card is a *problem count*, not a metric. Zero is the healthy answer to
 * all of them, so anything non-zero renders as a warning the admin can click
 * straight through to the filtered list behind it. Throughput and volume
 * figures live on the government's screens — an operator who has to scan past
 * them to find the one queue nobody is working is being shown the wrong thing.
 */
export default function AdminDashboard() {
  const health = useSystemHealth();
  const data = health.data;

  return (
    <div className="flex flex-col min-h-full w-full bg-background">
      <main className="flex-grow px-4 md:px-8 max-w-7xl mx-auto w-full pb-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Platform Operations</h1>
            <p className="text-lg text-muted-foreground mt-1">
              Accounts, coverage and wallets. Everything here needs a human, or nothing does.
            </p>
          </div>
          {data && (
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Users className="w-4 h-4" />
              {data.totalUsers.toLocaleString()} accounts
            </Badge>
          )}
        </div>

        {health.error ? (
          <Card className="ring-destructive/40">
            <CardContent className="flex flex-col items-center gap-3 text-center py-12">
              <div className="p-3 rounded-full bg-destructive/10 text-destructive">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-base font-medium text-destructive max-w-md">{health.error}</p>
              <Button variant="outline" size="sm" onClick={() => health.refetch()}>
                Try again
              </Button>
            </CardContent>
          </Card>
        ) : health.isLoading ? (
          <LoadingSkeleton />
        ) : data ? (
          <>
            <WarningGrid data={data} />
            <RoleBreakdown counts={data.userCountsByRole} />
            <VacantAreas data={data} />
          </>
        ) : null}
      </main>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="space-y-3 py-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-3 w-48" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6 py-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-10" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

interface WarningCardProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  count: number;
  description: string;
  href: string;
  /** Set when a non-zero count is not merely untidy but actively breaking. */
  critical?: boolean;
}

/**
 * One warning. Reads as a plain card at zero and lights up otherwise — the
 * colour is the signal, so a healthy platform is visually quiet.
 */
function WarningCard({
  icon: Icon,
  label,
  count,
  description,
  href,
  critical = false,
}: WarningCardProps) {
  const raised = count > 0;
  // Spelled out rather than interpolated: Tailwind only ships classes it can
  // see as complete strings in the source, so `text-${tone}` compiles to
  // nothing at all.
  const countColour = !raised
    ? "text-foreground"
    : critical
      ? "text-destructive"
      : "text-amber-600 dark:text-amber-500";

  return (
    <Card
      className={
        raised
          ? critical
            ? "ring-destructive/40 bg-destructive/5"
            : "ring-amber-500/40 bg-amber-500/5"
          : ""
      }
    >
      <CardContent className="space-y-3 py-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon className="w-4 h-4" />
            <p className="text-sm font-medium">{label}</p>
          </div>
          {!raised && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />}
        </div>

        <p className={`text-3xl font-bold tabular-nums ${countColour}`}>
          {count.toLocaleString()}
        </p>

        <p className="text-xs text-muted-foreground">{raised ? description : "Nothing to action."}</p>

        {raised && (
          <Button variant="outline" size="sm" render={<Link href={href} />}>
            Review
            <ArrowRight />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function WarningGrid({ data }: { data: NonNullable<ReturnType<typeof useSystemHealth>["data"]> }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold text-foreground">Needs attention</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <WarningCard
          icon={Wallet}
          label="Officers without a wallet"
          count={data.unlinkedOfficerWallets}
          description="Stock cannot be transferred to their area — the transfer needs an address to send to."
          href="/admin/wallets"
          critical
        />
        <WarningCard
          icon={Wallet}
          label="Government admins without a wallet"
          count={data.unlinkedGovernmentAdminWallets}
          description="They cannot mint a batch or issue credits until a wallet is linked."
          href="/admin/wallets"
          critical
        />
        <WarningCard
          icon={MapPinOff}
          label="Vacant areas"
          count={data.vacantAreaCount}
          description="No officer reviews these farmers' requests and no stock can be sent there."
          href="/admin/areas"
          critical
        />
        <WarningCard
          icon={ClipboardList}
          label={`Requests unreviewed over ${data.staleAfterDays} days`}
          count={data.staleFertilizerRequests}
          description="Farmers waiting on an officer who has not worked the queue."
          href="/admin/areas"
        />
        <WarningCard
          icon={ShoppingCart}
          label={`Orders unconfirmed over ${data.staleAfterDays} days`}
          count={data.staleMarketOrders}
          description="Sellers have not marked these ready. Stock stays reserved meanwhile."
          href="/admin/audit-log"
        />
        <WarningCard
          icon={Flag}
          label="Disputed handovers"
          count={data.disputedDistributions}
          description="Farmers report never receiving these. Nothing reverses automatically."
          href="/handover-history"
        />
        <WarningCard
          icon={Wallet}
          label="Accounts without a wallet"
          count={data.unlinkedWallets}
          description="Includes farmers and sellers who simply have not connected one yet."
          href="/admin/wallets"
        />
        <WarningCard
          icon={UserX}
          label="Banned accounts"
          count={data.bannedUsers}
          description="Blocked from signing in, and blocked mid-session on their next request."
          href="/admin/users?isBanned=true"
        />
      </div>
    </section>
  );
}

function RoleBreakdown({ counts }: { counts: Record<string, number> }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold text-foreground">Accounts by role</h2>
      </div>

      <Card>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6 py-2">
          {ALL_ROLES.map((role) => (
            <Link
              key={role}
              href={`/admin/users?role=${role}`}
              className="group space-y-1 rounded-lg transition-colors"
            >
              <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {formatRole(role)}
              </p>
              <p className="text-2xl font-bold text-foreground tabular-nums">
                {(counts[role] ?? 0).toLocaleString()}
              </p>
            </Link>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}

function VacantAreas({ data }: { data: NonNullable<ReturnType<typeof useSystemHealth>["data"]> }) {
  if (data.vacantAreas.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <MapPinOff className="w-5 h-5 text-destructive" />
        <h2 className="text-xl font-semibold text-foreground">Areas with no serving officer</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {data.vacantAreas.map((area) => (
          <Card key={area.areaId} className="ring-destructive/40">
            <CardContent className="space-y-2 py-2">
              <p className="text-base font-semibold text-foreground">{area.areaName}</p>
              <p className="text-sm text-muted-foreground">{area.district}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Badge variant="muted">{area.farmerCount.toLocaleString()} farmers</Badge>
                <Badge variant={area.pendingRequestCount > 0 ? "warning" : "muted"}>
                  {area.pendingRequestCount.toLocaleString()} pending requests
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button variant="outline" size="lg" render={<Link href="/admin/areas" />}>
        Manage coverage
        <ArrowRight />
      </Button>
    </section>
  );
}
