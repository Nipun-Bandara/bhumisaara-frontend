"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import apiPaths from "@/utils/apiPaths";
import type { PendingCollection, Sack } from "@/lib/distribution";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WalletAssets from "@/components/WalletAssets";
import { ArrowRight, Flame, PackageOpen, Users } from "lucide-react";

interface OfficerProfile {
  userId: number;
  username: string;
  email: string;
  areaId: number | null;
  areaName: string | null;
  district: string | null;
}

interface StockLine {
  fertilizerType: string;
  totalKg: number;
  sackCount: number;
}

const describeError = (error: unknown, fallback: string) => {
  if (isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
};

export default function AgrarianDashboard() {
  const router = useRouter();

  const [profile, setProfile] = useState<OfficerProfile | null>(null);
  const [sacks, setSacks] = useState<Sack[]>([]);
  const [pending, setPending] = useState<PendingCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const [profileResponse, sacksResponse, pendingResponse] = await Promise.all([
        axiosInstance.get<OfficerProfile>(apiPaths.officers.me),
        axiosInstance.get<Sack[]>(apiPaths.sacks.mine),
        axiosInstance.get<PendingCollection[]>(apiPaths.distributions.pending),
      ]);

      setProfile(profileResponse.data ?? null);
      setSacks(sacksResponse.data || []);
      setPending(pendingResponse.data || []);
    } catch (error) {
      setLoadError(describeError(error, "Could not load your centre's data."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /** Real stock: the sacks physically in this officer's custody, by type. */
  const stockLines = useMemo<StockLine[]>(() => {
    const lines = new Map<string, StockLine>();

    sacks.forEach((sack) => {
      const fertilizerType = sack.fertilizerType ?? "Unknown type";
      const line = lines.get(fertilizerType) ?? { fertilizerType, totalKg: 0, sackCount: 0 };
      line.totalKg += Number(sack.weightKg || 0);
      line.sackCount += 1;
      lines.set(fertilizerType, line);
    });

    return [...lines.values()].sort((a, b) => b.totalKg - a.totalKg);
  }, [sacks]);

  const totalStockKg = useMemo(
    () => stockLines.reduce((sum, line) => sum + line.totalKg, 0),
    [stockLines]
  );

  const owedKg = useMemo(
    () => pending.reduce((sum, row) => sum + Number(row.remainingKg || 0), 0),
    [pending]
  );

  const centreName = profile?.areaName
    ? `${profile.areaName} Agrarian Service Center`
    : "Agrarian Service Center";

  return (
    <div className="flex flex-col min-h-full w-full bg-background">
      <main className="flex-grow px-4 md:px-8 max-w-7xl mx-auto w-full pb-8 space-y-8">

        {/* Header Info */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">
              {isLoading ? "Loading your centre..." : centreName}
            </h1>
            <p className="text-lg text-muted-foreground">
              {profile?.district
                ? `${profile.district} district · manage stock and hand over to verified farmers.`
                : "Manage inventory and process digital handovers to verified farmers."}
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-4 py-2 bg-secondary/30 text-secondary-foreground text-sm font-medium rounded-full border border-secondary/20 w-fit">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            Connected to Polygon Amoy Testnet
          </div>
        </div>

        {loadError && (
          <Card className="border-destructive/40 shadow-sm">
            <CardContent className="pt-6 flex flex-col items-start gap-4">
              <p className="text-base text-destructive">{loadError}</p>
              <Button variant="outline" onClick={loadData}>
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {!isLoading && !loadError && !profile?.areaId && (
          <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-5 py-4 text-sm text-destructive">
            You are not assigned to an area yet, so no farmers appear in your queue. Ask a
            government administrator to assign you.
          </div>
        )}

        {/* Bento Grid Layout for Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 w-full">

          {/* Handover entry point (Primary Column) */}
          {/* The handover is a three-stage scanning flow with its own screen —
              it outgrew this dashboard cell, so this is the way in. */}
          <section className="xl:col-span-8 flex flex-col h-full">
            <Card className="border-border shadow-sm flex flex-col h-full">
              <CardHeader className="border-b border-border pb-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Flame className="text-primary w-6 h-6" />
                    <CardTitle className="text-2xl font-bold text-foreground">Digital Handover</CardTitle>
                  </div>
                  {!isLoading && pending.length > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                      <Users className="w-4 h-4" />
                      {pending.length} waiting
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-6 flex flex-col gap-6 flex-1 justify-center">
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">Farmers awaiting collection</span>
                    <span className="text-4xl font-bold text-foreground tabular-nums">
                      {isLoading ? "—" : pending.length}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">Still owed to them</span>
                    <span className="text-4xl font-bold text-foreground tabular-nums">
                      {isLoading ? "—" : `${owedKg.toLocaleString()}kg`}
                    </span>
                  </div>
                </div>
                <p className="text-base text-muted-foreground">
                  Pick a farmer from your collection queue, scan the sacks you are handing over,
                  confirm their wallet QR, then burn the matching tokens on-chain.
                </p>
                <Button
                  type="button"
                  onClick={() => router.push("/handover")}
                  className="h-12 px-8 w-fit text-sm font-semibold shadow-md hover:shadow-lg rounded-xl flex items-center gap-2 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Start a Handover
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Secondary Column (Inventory) */}
          <section className="xl:col-span-4 flex flex-col h-full">
            <Card className="border-border shadow-sm flex flex-col h-full">
              <CardHeader className="border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <PackageOpen className="text-primary w-6 h-6" />
                  <CardTitle className="text-2xl font-bold text-foreground">Local Inventory</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 flex flex-col gap-6">
                {isLoading ? (
                  <p className="text-sm text-muted-foreground">Loading your stock...</p>
                ) : stockLines.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No sacks in your custody. Stock appears here once the ministry transfers a batch
                    to your wallet.
                  </p>
                ) : (
                  stockLines.map((line) => (
                    <div
                      key={line.fertilizerType}
                      className="bg-muted/20 p-6 rounded-lg border border-border flex flex-col gap-3"
                    >
                      <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        {line.fertilizerType}
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold text-primary tabular-nums">
                          {line.totalKg.toLocaleString()}
                        </span>
                        <span className="text-base text-muted-foreground">kg left</span>
                      </div>
                      {/* Share of this officer's own stock, not of a fictional capacity */}
                      <div className="w-full bg-muted h-2.5 rounded-full mt-2 overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full"
                          style={{
                            width: `${totalStockKg > 0 ? Math.round((line.totalKg / totalStockKg) * 100) : 0}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {line.sackCount} {line.sackCount === 1 ? "sack" : "sacks"} in your store
                      </span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </section>
        </div>

        {/* The on-chain side of the same stock listed under Local Inventory */}
        <WalletAssets description="Batch tokens in your wallet — burned as you hand sacks to farmers." />
      </main>
    </div>
  );
}
