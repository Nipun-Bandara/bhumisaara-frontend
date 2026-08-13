"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import axiosInstance from "@/utils/axiosInstance";
import apiPaths from "@/utils/apiPaths";
import { describeApiError } from "@/utils/apiError";
import { formatDateTime } from "@/utils/formatters";
import { useAdminAreas, useAdminUser } from "@/hooks/use-admin";
import { ALL_ROLES, formatRole } from "@/lib/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import {
  AlertCircle,
  ArrowLeft,
  Ban,
  KeyRound,
  MapPin,
  RotateCcw,
  ShieldAlert,
  UserCog,
  Wallet,
} from "lucide-react";

const UNASSIGNED = "__unassigned__";
const MIN_PASSWORD_LENGTH = 8;

type PendingAction = "ban" | "unban" | "role" | "area" | "wallet" | "password" | null;

/**
 * One account, and every administrative action that applies to it.
 *
 * The activity counts are shown before the actions on purpose: "change this
 * user's role" reads very differently next to *0 records* than next to *40
 * handovers*, and the server refuses a role change while the user still holds
 * state their new role could not own. Seeing the counts first means the admin
 * meets the blocker before the error message, not after.
 */
export default function AdminUserDetail({ userId }: { userId: number }) {
  const userQuery = useAdminUser(userId);
  const areasQuery = useAdminAreas();
  const user = userQuery.data;

  const [pending, setPending] = useState<PendingAction>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [nextRole, setNextRole] = useState<string>("");
  const [nextAreaId, setNextAreaId] = useState<string>("");
  const [newPassword, setNewPassword] = useState("");

  const closeDialog = () => {
    setPending(null);
    setNewPassword("");
  };

  /** One request runner: same toast pattern, same refetch, same error text. */
  const run = async (
    loading: string,
    request: () => Promise<unknown>,
    success: string,
    failure: string,
    successDescription?: string
  ) => {
    setIsSaving(true);
    const toastId = toast.loading(loading);

    try {
      await request();
      await userQuery.refetch();
      toast.dismiss(toastId);
      toast.success(success, { description: successDescription });
      closeDialog();
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(failure, {
        // The backend's message names the actual blocker — the area an officer
        // still serves, the listings a seller still has active. It is always
        // more useful than anything this screen could guess.
        description: describeApiError(error, "Please check the server connection."),
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (userQuery.isLoading) {
    return <DetailSkeleton />;
  }

  if (userQuery.error || !user) {
    return (
      <div className="flex flex-col min-h-full w-full bg-background">
        <main className="flex-grow px-4 md:px-8 max-w-5xl mx-auto w-full pb-8 space-y-6">
          <BackLink />
          <Card className="ring-destructive/40">
            <CardContent className="flex flex-col items-center gap-3 text-center py-12">
              <div className="p-3 rounded-full bg-destructive/10 text-destructive">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-base font-medium text-destructive max-w-md">
                {userQuery.error ?? "This user could not be found."}
              </p>
              <Button variant="outline" size="sm" onClick={() => userQuery.refetch()}>
                Try again
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const isOfficer = user.role === "AGRARIAN_SERVICE_OFFICER";
  const isAdmin = user.role === "SYSTEM_ADMIN";
  const currentArea = user.areaName ? `${user.areaName}, ${user.district}` : "no area";

  return (
    <div className="flex flex-col min-h-full w-full bg-background">
      <main className="flex-grow px-4 md:px-8 max-w-5xl mx-auto w-full pb-8 space-y-8">
        <BackLink />

        {/* ─── Identity ───────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">{user.username}</h1>
            <p className="text-lg text-muted-foreground mt-1">{user.email}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{formatRole(user.role)}</Badge>
            {user.isBanned ? (
              <Badge variant="destructive">
                <Ban />
                Banned
              </Badge>
            ) : (
              <Badge variant="success">Active</Badge>
            )}
            {!user.walletLinked && (
              <Badge variant="warning">
                <Wallet />
                No wallet
              </Badge>
            )}
          </div>
        </div>

        {/* ─── Profile ────────────────────────────────────────────────── */}
        <Card>
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-xl font-semibold">Account</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 pt-2">
            <Field label="Full name" value={user.fullName} />
            <Field label="Contact number" value={user.contactNumber} />
            <Field label="Address" value={user.address} />
            <Field label="Area" value={user.areaName ? currentArea : null} />
            <Field
              label="Wallet"
              value={user.walletAddressTruncated}
              mono
              hint={user.walletLinked ? undefined : "Not connected yet"}
            />
            <Field label="Joined" value={formatDateTime(user.createdAt)} />
          </CardContent>
        </Card>

        {/* ─── Activity ───────────────────────────────────────────────── */}
        <Card>
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-xl font-semibold">Activity</CardTitle>
            <p className="text-sm text-muted-foreground">
              What this account owns in the domain. A role change is refused while any of it can
              only belong to the current role.
            </p>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 pt-2">
            <Stat label="Subsidy requests" value={user.fertilizerRequestCount} />
            <Stat label="Requests reviewed" value={user.requestsReviewedCount} />
            <Stat label="Handovers" value={user.distributionCount} />
            <Stat label="Market orders" value={user.orderCount} />
            <Stat label="Listings" value={user.listingCount} />
          </CardContent>
        </Card>

        {/* ─── Actions ────────────────────────────────────────────────── */}
        <Card>
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-xl font-semibold">Administration</CardTitle>
            <p className="text-sm text-muted-foreground">
              Each of these is recorded in the audit log against your account.
            </p>
          </CardHeader>
          <CardContent className="divide-y divide-border pt-2">
            <ActionRow
              icon={UserCog}
              title="Change role"
              description={`Currently ${formatRole(user.role)}. Moving a user between roles changes which queues and wallets they can act through.`}
              action={
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setNextRole("");
                    setPending("role");
                  }}
                >
                  Change role
                </Button>
              }
            />

            {isOfficer && (
              <ActionRow
                icon={MapPin}
                title="Assign area"
                description={`Currently serving ${currentArea}. An area can only have one serving officer, and stock transfers are addressed by area.`}
                action={
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      setNextAreaId(user.areaId ? String(user.areaId) : UNASSIGNED);
                      setPending("area");
                    }}
                  >
                    Assign area
                  </Button>
                }
              />
            )}

            <ActionRow
              icon={KeyRound}
              title="Reset password"
              description="Sets a new password for a user who has lost access. It is hashed on arrival and never shown again — pass it to them out of band."
              action={
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setNewPassword("");
                    setPending("password");
                  }}
                >
                  Reset password
                </Button>
              }
            />

            <ActionRow
              icon={Wallet}
              title="Clear wallet link"
              description="For a user who has lost access to their thirdweb account. They must reconnect and sign with the new wallet themselves — an operator can never set an address, only remove one."
              action={
                <Button
                  variant="destructive"
                  size="lg"
                  disabled={!user.walletLinked}
                  onClick={() => setPending("wallet")}
                >
                  Clear wallet
                </Button>
              }
            />

            <ActionRow
              icon={user.isBanned ? RotateCcw : ShieldAlert}
              title={user.isBanned ? "Restore access" : "Ban account"}
              description={
                user.isBanned
                  ? "Lets this account sign in and use the platform again."
                  : "Blocks sign-in and rejects the account's very next request, rather than waiting for their token to expire."
              }
              action={
                user.isBanned ? (
                  <Button variant="outline" size="lg" onClick={() => setPending("unban")}>
                    Restore access
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    size="lg"
                    disabled={isAdmin}
                    onClick={() => setPending("ban")}
                  >
                    Ban account
                  </Button>
                )
              }
            />

            {isAdmin && (
              <p className="pt-4 text-xs text-muted-foreground">
                System administrators cannot ban one another, and the last remaining one cannot be
                demoted — otherwise a single operator could seize sole control of the platform, or
                lock everyone out of it.
              </p>
            )}
          </CardContent>
        </Card>
      </main>

      {/* ─── Confirmations ────────────────────────────────────────────── */}

      <ConfirmDialog
        open={pending === "ban"}
        onOpenChange={(open) => !open && closeDialog()}
        destructive
        title="Ban this account?"
        description={
          <>
            <strong className="text-foreground">{user.username}</strong> will be blocked from
            signing in, and their current session stops working on the next request. Their{" "}
            {user.fertilizerRequestCount + user.distributionCount + user.orderCount} existing
            record(s) are left untouched.
          </>
        }
        confirmLabel="Ban account"
        pendingLabel="Banning..."
        isPending={isSaving}
        onConfirm={() =>
          run(
            "Banning account...",
            () => axiosInstance.post(apiPaths.admin.ban(user.userId)),
            `${user.username} has been banned.`,
            "Could not ban this account."
          )
        }
      />

      <ConfirmDialog
        open={pending === "unban"}
        onOpenChange={(open) => !open && closeDialog()}
        title="Restore this account?"
        description={
          <>
            <strong className="text-foreground">{user.username}</strong> will be able to sign in and
            use the platform again.
          </>
        }
        confirmLabel="Restore access"
        pendingLabel="Restoring..."
        isPending={isSaving}
        onConfirm={() =>
          run(
            "Restoring access...",
            () => axiosInstance.post(apiPaths.admin.unban(user.userId)),
            `${user.username} can sign in again.`,
            "Could not restore access."
          )
        }
      />

      <ConfirmDialog
        open={pending === "role"}
        onOpenChange={(open) => !open && closeDialog()}
        destructive
        title="Change this user's role?"
        description={
          <>
            <strong className="text-foreground">{user.username}</strong> is currently{" "}
            {formatRole(user.role)}. The change is refused if they still hold records only that role
            can own — an area they serve, active listings, or open orders.
          </>
        }
        confirmLabel="Change role"
        pendingLabel="Changing..."
        isPending={isSaving}
        confirmDisabled={!nextRole || nextRole === user.role}
        onConfirm={() =>
          run(
            "Changing role...",
            () => axiosInstance.patch(apiPaths.admin.role(user.userId), { role: nextRole }),
            `${user.username} is now ${formatRole(nextRole)}.`,
            "Could not change the role.",
            "They must sign in again for their new permissions to take effect."
          )
        }
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="nextRole" className="text-sm font-medium text-foreground">
            New role
          </label>
          <Select value={nextRole} onValueChange={(value) => setNextRole(String(value ?? ""))}>
            <SelectTrigger id="nextRole" className="w-full h-11 bg-background">
              <SelectValue>
                {(value) => (value ? formatRole(String(value)) : "Choose a role")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {ALL_ROLES.filter((role) => role !== user.role).map((role) => (
                <SelectItem key={role} value={role}>
                  {formatRole(role)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {nextRole === "SYSTEM_ADMIN" && (
            <p className="text-xs text-amber-600 dark:text-amber-500">
              This grants full administration of every account on the platform, including yours.
            </p>
          )}
          {(nextRole === "GOVERNMENT_ADMIN" || nextRole === "AGRARIAN_SERVICE_OFFICER") && (
            <p className="text-xs text-muted-foreground">
              This role signs on-chain transactions. They will need a linked wallet before they can
              do anything with it.
            </p>
          )}
        </div>
      </ConfirmDialog>

      <ConfirmDialog
        open={pending === "area"}
        onOpenChange={(open) => !open && closeDialog()}
        title="Assign this officer's area?"
        description={
          <>
            <strong className="text-foreground">{user.username}</strong> currently serves{" "}
            {currentArea}. Stock transfers are addressed by area, so reassigning them redirects
            every future delivery.
          </>
        }
        confirmLabel="Save assignment"
        pendingLabel="Saving..."
        isPending={isSaving}
        confirmDisabled={
          !nextAreaId ||
          nextAreaId === String(user.areaId ?? "") ||
          (nextAreaId === UNASSIGNED && user.areaId === null)
        }
        onConfirm={() =>
          run(
            "Saving assignment...",
            () =>
              axiosInstance.patch(apiPaths.admin.area(user.userId), {
                areaId: nextAreaId === UNASSIGNED ? null : Number(nextAreaId),
              }),
            nextAreaId === UNASSIGNED
              ? `${user.username} is no longer assigned to an area.`
              : `${user.username}'s area has been updated.`,
            "Could not save the assignment."
          )
        }
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="nextArea" className="text-sm font-medium text-foreground">
            Area
          </label>
          <Select
            value={nextAreaId}
            onValueChange={(value) => setNextAreaId(String(value ?? ""))}
            disabled={areasQuery.isLoading}
          >
            <SelectTrigger id="nextArea" className="w-full h-11 bg-background">
              <SelectValue>
                {(value) => {
                  const raw = String(value ?? "");
                  if (raw === UNASSIGNED) return "Unassigned";
                  const area = areasQuery.data.find((item) => String(item.areaId) === raw);
                  return area ? `${area.areaName} · ${area.district}` : "Choose an area";
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
              {areasQuery.data
                .filter((area) => area.isActive)
                .map((area) => (
                  <SelectItem key={area.areaId} value={String(area.areaId)}>
                    {area.areaName} · {area.district}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            An area already served by another officer is refused, naming the incumbent. Unassign
            them first.
          </p>
        </div>
      </ConfirmDialog>

      <ConfirmDialog
        open={pending === "password"}
        onOpenChange={(open) => !open && closeDialog()}
        destructive
        title="Reset this user's password?"
        description={
          <>
            <strong className="text-foreground">{user.username}</strong> will only be able to sign
            in with the new password. It is stored hashed and cannot be read back, so give it to
            them through a channel you trust.
          </>
        }
        confirmLabel="Reset password"
        pendingLabel="Resetting..."
        isPending={isSaving}
        confirmDisabled={newPassword.length < MIN_PASSWORD_LENGTH}
        onConfirm={() =>
          run(
            "Resetting password...",
            () =>
              axiosInstance.post(apiPaths.admin.resetPassword(user.userId), {
                newPassword,
              }),
            `${user.username}'s password has been reset.`,
            "Could not reset the password.",
            "Pass the new password to them out of band — it is not recoverable from here."
          )
        }
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="newPassword" className="text-sm font-medium text-foreground">
            New password
          </label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
            className="h-11"
            autoComplete="new-password"
          />
          <p className="text-xs text-muted-foreground">
            {newPassword.length > 0 && newPassword.length < MIN_PASSWORD_LENGTH
              ? `${MIN_PASSWORD_LENGTH - newPassword.length} more character(s) needed.`
              : "Never reused from another account."}
          </p>
        </div>
      </ConfirmDialog>

      <ConfirmDialog
        open={pending === "wallet"}
        onOpenChange={(open) => !open && closeDialog()}
        destructive
        title="Clear this wallet link?"
        description={
          <>
            <strong className="text-foreground">{user.username}</strong>&apos;s wallet{" "}
            <span className="font-mono">{user.walletAddressTruncated}</span> will be unlinked. Any
            tokens it already holds stay on-chain and are unaffected — this only clears the address
            recorded against the account, so they can connect a new one.
          </>
        }
        confirmLabel="Clear wallet"
        pendingLabel="Clearing..."
        isPending={isSaving}
        onConfirm={() =>
          run(
            "Clearing wallet...",
            () => axiosInstance.delete(apiPaths.admin.wallet(user.userId)),
            `${user.username}'s wallet has been unlinked.`,
            "Could not clear the wallet.",
            "They must connect and sign with a wallet themselves to relink."
          )
        }
      />
    </div>
  );
}

function BackLink() {
  return (
    <Button variant="ghost" size="sm" render={<Link href="/admin/users" />}>
      <ArrowLeft />
      All users
    </Button>
  );
}

function Field({
  label,
  value,
  mono = false,
  hint,
}: {
  label: string;
  value: string | null | undefined;
  mono?: boolean;
  hint?: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className={`text-sm text-foreground ${mono ? "font-mono" : ""}`}>
        {value ?? <span className="text-muted-foreground">{hint ?? "—"}</span>}
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold text-foreground tabular-nums">{value.toLocaleString()}</p>
    </div>
  );
}

function ActionRow({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-muted text-muted-foreground shrink-0">
          <Icon className="w-4 h-4" />
        </div>
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground max-w-xl">{description}</p>
        </div>
      </div>
      <div className="shrink-0 sm:self-center">{action}</div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="flex flex-col min-h-full w-full bg-background">
      <main className="flex-grow px-4 md:px-8 max-w-5xl mx-auto w-full pb-8 space-y-8">
        <Skeleton className="h-8 w-28" />
        <div className="space-y-2">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-6 w-72" />
        </div>
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="space-y-4 py-4">
              <Skeleton className="h-5 w-32" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((__, inner) => (
                  <div key={inner} className="space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </main>
    </div>
  );
}
