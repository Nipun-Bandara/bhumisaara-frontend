"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import axiosInstance from "@/utils/axiosInstance";
import apiPaths from "@/utils/apiPaths";
import { describeApiError } from "@/utils/apiError";
import { formatDate } from "@/utils/formatters";
import { useAdminAreas, useAdminUsers } from "@/hooks/use-admin";
import { ALL_ROLES, formatRole } from "@/lib/admin";
import type { AdminUserSummary } from "@/lib/admin";
import type { Role } from "@/lib/navigation";
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
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { ArrowLeft, ArrowRight, Ban, RotateCcw, Search, Users, Wallet } from "lucide-react";

const ANY = "__any__";
const COLUMNS = 8;
const PAGE_SIZE = 25;

type BanTarget = { user: AdminUserSummary; action: "ban" | "unban" };

/**
 * The user directory.
 *
 * Filters live in the URL rather than in component state, so the dashboard's
 * warning cards can link straight to a filtered view
 * (`/admin/users?isBanned=true`) and an admin can share or bookmark one.
 */
export default function AdminUsers() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const roleParam = searchParams.get("role");
  const areaParam = searchParams.get("areaId");
  const bannedParam = searchParams.get("isBanned");
  const searchParam = searchParams.get("search") ?? "";
  const pageParam = Number(searchParams.get("page") ?? 0);

  // The text box is uncontrolled by the URL while typing — pushing a route on
  // every keystroke would refetch six times for one word. It only re-syncs
  // when the URL changes from elsewhere ("Clear filters", a dashboard link).
  //
  // Adjusted during render rather than in an effect: an effect that calls
  // setState causes a cascading render, which `react-hooks/set-state-in-effect`
  // rejects outright. React re-runs this component immediately and renders
  // once, before anything reaches the DOM.
  const [searchDraft, setSearchDraft] = useState(searchParam);
  const [syncedSearchParam, setSyncedSearchParam] = useState(searchParam);
  if (searchParam !== syncedSearchParam) {
    setSyncedSearchParam(searchParam);
    setSearchDraft(searchParam);
  }

  const [banTarget, setBanTarget] = useState<BanTarget | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const areasQuery = useAdminAreas();
  const usersQuery = useAdminUsers({
    role: (roleParam as Role | null) ?? null,
    areaId: areaParam ? Number(areaParam) : null,
    isBanned: bannedParam === null ? null : bannedParam === "true",
    search: searchParam,
    page: Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 0,
    size: PAGE_SIZE,
  });

  const users = usersQuery.data?.content ?? [];
  const totalElements = usersQuery.data?.totalElements ?? 0;
  const totalPages = usersQuery.data?.totalPages ?? 0;
  const currentPage = usersQuery.data?.page ?? 0;

  /** Writes one filter into the URL, resetting to page 0 unless paging. */
  const setParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(searchParams.toString());
      if (value === null || value === "") {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      if (key !== "page") {
        next.delete("page");
      }
      router.replace(next.toString() ? `/admin/users?${next}` : "/admin/users");
    },
    [router, searchParams]
  );

  const handleBanConfirm = async () => {
    if (!banTarget) return;

    const { user, action } = banTarget;
    setIsSaving(true);
    const toastId = toast.loading(action === "ban" ? "Banning account..." : "Restoring access...");

    try {
      await axiosInstance.post(
        action === "ban" ? apiPaths.admin.ban(user.userId) : apiPaths.admin.unban(user.userId)
      );
      await usersQuery.refetch();

      toast.dismiss(toastId);
      toast.success(
        action === "ban" ? `${user.username} has been banned.` : `${user.username} can sign in again.`,
        {
          description:
            action === "ban"
              ? "Their next request is rejected — they do not stay signed in until the token expires."
              : undefined,
        }
      );
      setBanTarget(null);
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(action === "ban" ? "Could not ban this account." : "Could not restore access.", {
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
            <h1 className="text-3xl font-bold text-primary">Users</h1>
            <p className="text-lg text-muted-foreground mt-1">
              Every account on the platform, and what may be done with it.
            </p>
          </div>
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            <Users className="w-4 h-4" />
            {totalElements.toLocaleString()} matching
          </Badge>
        </div>

        {/* ─── Filters ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <form
            className="flex flex-col gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              setParam("search", searchDraft.trim() || null);
            }}
          >
            <label htmlFor="userSearch" className="text-sm font-medium text-muted-foreground">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                id="userSearch"
                value={searchDraft}
                onChange={(event) => setSearchDraft(event.target.value)}
                placeholder="Username or email"
                className="h-11 pl-8"
              />
            </div>
          </form>

          <div className="flex flex-col gap-2">
            <label htmlFor="roleFilter" className="text-sm font-medium text-muted-foreground">
              Role
            </label>
            <Select
              value={roleParam ?? ANY}
              onValueChange={(value) => setParam("role", String(value) === ANY ? null : String(value))}
            >
              <SelectTrigger id="roleFilter" className="w-full h-11 bg-background">
                <SelectValue>
                  {(value) => (String(value) === ANY ? "Any role" : formatRole(String(value)))}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Any role</SelectItem>
                {ALL_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {formatRole(role)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="areaFilter" className="text-sm font-medium text-muted-foreground">
              Area
            </label>
            <Select
              value={areaParam ?? ANY}
              onValueChange={(value) =>
                setParam("areaId", String(value) === ANY ? null : String(value))
              }
              disabled={areasQuery.isLoading}
            >
              <SelectTrigger id="areaFilter" className="w-full h-11 bg-background">
                <SelectValue>
                  {(value) => {
                    if (String(value ?? ANY) === ANY) return "Any area";
                    const area = areasQuery.data.find((item) => String(item.areaId) === String(value));
                    return area ? `${area.areaName} · ${area.district}` : "Any area";
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Any area</SelectItem>
                {areasQuery.data.map((area) => (
                  <SelectItem key={area.areaId} value={String(area.areaId)}>
                    {area.areaName} · {area.district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="bannedFilter" className="text-sm font-medium text-muted-foreground">
              Status
            </label>
            <Select
              value={bannedParam ?? ANY}
              onValueChange={(value) =>
                setParam("isBanned", String(value) === ANY ? null : String(value))
              }
            >
              <SelectTrigger id="bannedFilter" className="w-full h-11 bg-background">
                <SelectValue>
                  {(value) => {
                    const raw = String(value ?? ANY);
                    if (raw === "true") return "Banned";
                    if (raw === "false") return "Active";
                    return "Any status";
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Any status</SelectItem>
                <SelectItem value="false">Active</SelectItem>
                <SelectItem value="true">Banned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ─── Directory ──────────────────────────────────────────────── */}
        <div className="bg-card rounded-xl ring-1 ring-foreground/10 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="border-border">
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">User</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">Email</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">Role</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">Area</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">Wallet</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">Status</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6">Joined</TableHead>
                  <TableHead className="font-semibold text-muted-foreground py-4 px-6 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersQuery.error ? (
                  <TableErrorState
                    columns={COLUMNS}
                    message={usersQuery.error}
                    onRetry={() => usersQuery.refetch()}
                  />
                ) : usersQuery.isLoading ? (
                  <TableSkeletonRows columns={COLUMNS} />
                ) : users.length === 0 ? (
                  <TableEmptyState
                    columns={COLUMNS}
                    icon={Users}
                    title="No accounts match these filters"
                    description="Clear a filter, or search a different username or email."
                    action={
                      <Button variant="outline" size="sm" render={<Link href="/admin/users" />}>
                        Clear filters
                      </Button>
                    }
                  />
                ) : (
                  users.map((user) => (
                    <TableRow
                      key={user.userId}
                      className="border-border hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="py-4 px-6">
                        <Link
                          href={`/admin/users/${user.userId}`}
                          className="font-medium text-foreground hover:text-primary transition-colors"
                        >
                          {user.username}
                        </Link>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-muted-foreground">{user.email}</TableCell>
                      <TableCell className="py-4 px-6">
                        <Badge variant="outline">{formatRole(user.role)}</Badge>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-muted-foreground">
                        {user.areaName ? `${user.areaName}, ${user.district}` : "—"}
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        {user.walletLinked ? (
                          <span className="font-mono text-xs text-muted-foreground">
                            {user.walletAddressTruncated}
                          </span>
                        ) : (
                          <Badge variant="muted">
                            <Wallet />
                            Unlinked
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        {user.isBanned ? (
                          <Badge variant="destructive">
                            <Ban />
                            Banned
                          </Badge>
                        ) : (
                          <Badge variant="success">Active</Badge>
                        )}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          {user.isBanned ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setBanTarget({ user, action: "unban" })}
                            >
                              <RotateCcw />
                              Unban
                            </Button>
                          ) : (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setBanTarget({ user, action: "ban" })}
                              // The server refuses this too; disabling it here
                              // just avoids offering a button that only errors.
                              disabled={user.role === "SYSTEM_ADMIN"}
                            >
                              <Ban />
                              Ban
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            render={<Link href={`/admin/users/${user.userId}`} />}
                          >
                            Manage
                            <ArrowRight />
                          </Button>
                        </div>
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
                  onClick={() => setParam("page", String(currentPage - 1))}
                >
                  <ArrowLeft />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage + 1 >= totalPages}
                  onClick={() => setParam("page", String(currentPage + 1))}
                >
                  Next
                  <ArrowRight />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <ConfirmDialog
        open={banTarget !== null}
        onOpenChange={(open) => !open && setBanTarget(null)}
        destructive={banTarget?.action === "ban"}
        title={banTarget?.action === "ban" ? "Ban this account?" : "Restore this account?"}
        description={
          banTarget ? (
            banTarget.action === "ban" ? (
              <>
                <strong className="text-foreground">{banTarget.user.username}</strong> (
                {banTarget.user.email}) will be signed out on their next request and blocked from
                signing in again. Their existing records are left untouched.
              </>
            ) : (
              <>
                <strong className="text-foreground">{banTarget.user.username}</strong> (
                {banTarget.user.email}) will be able to sign in and use the platform again.
              </>
            )
          ) : null
        }
        confirmLabel={banTarget?.action === "ban" ? "Ban account" : "Restore access"}
        pendingLabel={banTarget?.action === "ban" ? "Banning..." : "Restoring..."}
        onConfirm={handleBanConfirm}
        isPending={isSaving}
      />
    </div>
  );
}
