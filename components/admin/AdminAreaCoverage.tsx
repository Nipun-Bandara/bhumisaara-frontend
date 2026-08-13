"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import axiosInstance from "@/utils/axiosInstance";
import apiPaths from "@/utils/apiPaths";
import { describeApiError } from "@/utils/apiError";
import { useAreaCoverage } from "@/hooks/use-admin";
import type { AreaCoverage } from "@/lib/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import {
  ArrowRight,
  CheckCircle,
  Loader2,
  MapPin,
  MapPinOff,
  Plus,
  Power,
  PowerOff,
  Wallet,
} from "lucide-react";

const COLUMNS = 6;

type PendingArea = { area: AreaCoverage; action: "deactivate" | "activate" };

/**
 * Officer coverage, and the areas themselves.
 *
 * A vacancy is not a cosmetic gap: no officer reviews that area's requests,
 * and `BatchTransferService` resolves the recipient of a stock transfer from
 * the area alone, so nothing can be delivered there either. The farmer and
 * pending-request counts are on every row so the worst vacancy is obvious.
 */
export default function AdminAreaCoverage() {
  const coverageQuery = useAreaCoverage();

  const [pendingArea, setPendingArea] = useState<PendingArea | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newArea, setNewArea] = useState({ areaName: "", district: "" });

  const areas = coverageQuery.data;
  const vacantCount = areas.filter((area) => area.isVacant && area.isActive).length;

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();

    const areaName = newArea.areaName.trim();
    const district = newArea.district.trim();
    if (!areaName || !district) return;

    setIsCreating(true);
    const toastId = toast.loading("Creating area...");

    try {
      await axiosInstance.post(apiPaths.admin.areas, { areaName, district });
      await coverageQuery.refetch();

      toast.dismiss(toastId);
      toast.success(`${areaName}, ${district} has been created.`, {
        description: "Assign an officer to it before farmers register there.",
        icon: <CheckCircle className="w-5 h-5 text-primary" />,
      });
      setNewArea({ areaName: "", district: "" });
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Could not create the area.", {
        description: describeApiError(error, "Please check the server connection."),
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleActivationConfirm = async () => {
    if (!pendingArea) return;

    const { area, action } = pendingArea;
    const deactivating = action === "deactivate";

    setIsSaving(true);
    const toastId = toast.loading(deactivating ? "Deactivating area..." : "Reactivating area...");

    try {
      await axiosInstance.post(
        deactivating
          ? apiPaths.admin.deactivateArea(area.areaId)
          : apiPaths.admin.activateArea(area.areaId)
      );
      await coverageQuery.refetch();

      toast.dismiss(toastId);
      toast.success(
        deactivating
          ? `${area.areaName}, ${area.district} has been deactivated.`
          : `${area.areaName}, ${area.district} is active again.`,
        {
          description: deactivating
            ? "It no longer appears in any area picker. Its history is untouched."
            : undefined,
        }
      );
      setPendingArea(null);
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(
        deactivating ? "Could not deactivate the area." : "Could not reactivate the area.",
        { description: describeApiError(error, "Please check the server connection.") }
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full w-full bg-background">
      <main className="flex-grow px-4 md:px-8 max-w-7xl mx-auto w-full pb-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Area Coverage</h1>
            <p className="text-lg text-muted-foreground mt-1">
              Which areas have a serving officer, and what the gaps are costing.
            </p>
          </div>
          <Badge
            variant={vacantCount > 0 ? "destructive" : "success"}
            className="px-4 py-2 text-sm"
          >
            {vacantCount > 0 ? <MapPinOff className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
            {vacantCount > 0 ? `${vacantCount} vacant` : "Every active area covered"}
          </Badge>
        </div>

        {/* ─── New area ───────────────────────────────────────────────── */}
        <Card>
          <CardHeader className="border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl font-semibold">New Area</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <form
              onSubmit={handleCreate}
              className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 md:items-end"
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="areaName" className="text-sm font-medium text-muted-foreground">
                  Area name
                </label>
                <Input
                  id="areaName"
                  value={newArea.areaName}
                  onChange={(event) =>
                    setNewArea((current) => ({ ...current, areaName: event.target.value }))
                  }
                  placeholder="Kekirawa"
                  className="h-11"
                  maxLength={100}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="district" className="text-sm font-medium text-muted-foreground">
                  District
                </label>
                <Input
                  id="district"
                  value={newArea.district}
                  onChange={(event) =>
                    setNewArea((current) => ({ ...current, district: event.target.value }))
                  }
                  placeholder="Anuradhapura"
                  className="h-11"
                  maxLength={100}
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-11 px-6"
                disabled={isCreating || !newArea.areaName.trim() || !newArea.district.trim()}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create area"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* ─── Coverage table ─────────────────────────────────────────── */}
        <div className="bg-card rounded-xl ring-1 ring-foreground/10 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center gap-2">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold text-foreground">Areas</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="border-border">
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">Area</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">
                    Serving officer
                  </TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">Farmers</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">
                    Pending requests
                  </TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">Status</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coverageQuery.error ? (
                  <TableErrorState
                    columns={COLUMNS}
                    message={coverageQuery.error}
                    onRetry={() => coverageQuery.refetch()}
                  />
                ) : coverageQuery.isLoading ? (
                  <TableSkeletonRows columns={COLUMNS} />
                ) : areas.length === 0 ? (
                  <TableEmptyState
                    columns={COLUMNS}
                    icon={MapPin}
                    title="No areas exist yet"
                    description="Create one above. Officers are assigned to areas, and farmers register into them."
                  />
                ) : (
                  areas.map((area) => (
                    <TableRow
                      key={area.areaId}
                      className={`border-border hover:bg-muted/30 transition-colors ${
                        area.isVacant && area.isActive ? "bg-destructive/5" : ""
                      }`}
                    >
                      <TableCell className="py-4 px-6">
                        <p className="font-medium text-foreground">{area.areaName}</p>
                        <p className="text-xs text-muted-foreground">{area.district}</p>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        {area.isVacant ? (
                          <Badge variant={area.isActive ? "destructive" : "muted"}>
                            <MapPinOff />
                            Vacant
                          </Badge>
                        ) : (
                          <div className="space-y-1">
                            <Link
                              href={`/admin/users/${area.officerId}`}
                              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                            >
                              {area.officerUsername}
                            </Link>
                            {!area.officerWalletLinked && (
                              <Badge variant="warning">
                                <Wallet />
                                No wallet — cannot receive stock
                              </Badge>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="py-4 px-6 tabular-nums text-muted-foreground">
                        {area.farmerCount.toLocaleString()}
                      </TableCell>
                      <TableCell className="py-4 px-6 tabular-nums">
                        {area.pendingRequestCount > 0 && area.isVacant ? (
                          <Badge variant="warning">
                            {area.pendingRequestCount.toLocaleString()} waiting
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">
                            {area.pendingRequestCount.toLocaleString()}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        {area.isActive ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="muted">Deactivated</Badge>
                        )}
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          {area.isVacant ? (
                            <Button
                              variant="outline"
                              size="sm"
                              render={
                                <Link href="/admin/users?role=AGRARIAN_SERVICE_OFFICER" />
                              }
                            >
                              Assign officer
                              <ArrowRight />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              render={<Link href={`/admin/users/${area.officerId}`} />}
                            >
                              Reassign
                              <ArrowRight />
                            </Button>
                          )}
                          {area.isActive ? (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setPendingArea({ area, action: "deactivate" })}
                            >
                              <PowerOff />
                              Deactivate
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPendingArea({ area, action: "activate" })}
                            >
                              <Power />
                              Reactivate
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>

      <ConfirmDialog
        open={pendingArea !== null}
        onOpenChange={(open) => !open && setPendingArea(null)}
        destructive={pendingArea?.action === "deactivate"}
        title={pendingArea?.action === "deactivate" ? "Deactivate this area?" : "Reactivate this area?"}
        description={
          pendingArea ? (
            pendingArea.action === "deactivate" ? (
              <>
                <strong className="text-foreground">
                  {pendingArea.area.areaName}, {pendingArea.area.district}
                </strong>{" "}
                will disappear from every area picker, so no officer can be assigned to it and no
                farmer can register into it. Nothing is deleted — its requests, transfers and
                handovers stay in history. The server refuses this while an officer or any farmer
                still points at it.
              </>
            ) : (
              <>
                <strong className="text-foreground">
                  {pendingArea.area.areaName}, {pendingArea.area.district}
                </strong>{" "}
                will be selectable again and can take an officer.
              </>
            )
          ) : null
        }
        confirmLabel={pendingArea?.action === "deactivate" ? "Deactivate area" : "Reactivate area"}
        pendingLabel={pendingArea?.action === "deactivate" ? "Deactivating..." : "Reactivating..."}
        isPending={isSaving}
        onConfirm={handleActivationConfirm}
      />
    </div>
  );
}
