import type { Role } from "@/lib/navigation";

/**
 * The shapes behind `/api/v1/admin/**`, the SYSTEM_ADMIN operator surface.
 *
 * A system administrator is a *platform operator*, not a participant in the
 * fertilizer system: they decide who may act, and never act themselves. There
 * is deliberately nothing in this file about tokens, batches, credits,
 * listings or orders — those belong to the government and seller roles, and no
 * admin endpoint exposes them.
 */

/** The wire shape of every paginated admin list. */
export interface PageResponse<T> {
  content: T[];
  /** Zero-based, matching the `page` query parameter. */
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface AdminUserSummary {
  userId: number;
  username: string;
  email: string;
  role: Role | null;
  areaName: string | null;
  district: string | null;
  /** `0x1234…abcd`. The backend never sends the full address to a list view. */
  walletAddressTruncated: string | null;
  walletLinked: boolean;
  isBanned: boolean;
  createdAt: string;
}

export interface AdminUserDetail {
  userId: number;
  username: string;
  email: string;
  role: Role | null;
  fullName: string | null;
  address: string | null;
  contactNumber: string | null;
  areaId: number | null;
  areaName: string | null;
  district: string | null;
  isAssigned: boolean;
  walletAddressTruncated: string | null;
  walletLinked: boolean;
  isBanned: boolean;
  createdAt: string;
  /** What this account owns in the domain — read this before acting on them. */
  fertilizerRequestCount: number;
  requestsReviewedCount: number;
  distributionCount: number;
  orderCount: number;
  listingCount: number;
}

export interface AdminAuditLog {
  logId: number;
  actorUserId: number;
  actorUsername: string | null;
  action: string;
  targetUserId: number | null;
  targetUsername: string | null;
  targetEntity: string | null;
  details: string | null;
  createdAt: string;
}

export interface AreaCoverage {
  areaId: number;
  areaName: string;
  district: string;
  isActive: boolean;
  officerId: number | null;
  officerUsername: string | null;
  officerEmail: string | null;
  officerWalletLinked: boolean | null;
  isVacant: boolean;
  farmerCount: number;
  pendingRequestCount: number;
}

export interface AdminArea {
  areaId: number;
  areaName: string;
  district: string;
  isActive: boolean;
}

export interface AdminWalletStatus {
  userId: number;
  username: string;
  email: string;
  role: Role | null;
  areaName: string | null;
  walletAddressTruncated: string | null;
  walletLinked: boolean;
  /** An unlinked officer or government admin: the token flow silently fails. */
  blocking: boolean;
}

export interface SystemHealth {
  userCountsByRole: Record<string, number>;
  totalUsers: number;
  unlinkedWallets: number;
  unlinkedOfficerWallets: number;
  unlinkedGovernmentAdminWallets: number;
  vacantAreaCount: number;
  vacantAreas: AreaCoverage[];
  staleFertilizerRequests: number;
  staleMarketOrders: number;
  staleAfterDays: number;
  disputedDistributions: number;
  bannedUsers: number;
}

/** Every role, in platform hierarchy order — the order every picker uses. */
export const ALL_ROLES: Role[] = [
  "SYSTEM_ADMIN",
  "GOVERNMENT_ADMIN",
  "AGRARIAN_SERVICE_OFFICER",
  "FARMER",
  "PRIVATE_AGRO_DEALER",
  "ORGANIC_FERTILIZER_PRODUCER",
];

const ROLE_LABELS: Record<Role, string> = {
  SYSTEM_ADMIN: "System Admin",
  GOVERNMENT_ADMIN: "Government Admin",
  AGRARIAN_SERVICE_OFFICER: "Agrarian Officer",
  FARMER: "Farmer",
  PRIVATE_AGRO_DEALER: "Private Agro Dealer",
  ORGANIC_FERTILIZER_PRODUCER: "Organic Producer",
};

export const formatRole = (role: Role | string | null | undefined) =>
  role ? (ROLE_LABELS[role as Role] ?? role) : "No role";

/**
 * The actions `AuditService.Action` can write. Kept in step with the backend
 * constants by hand — the log filter offers exactly these, so a typo would
 * silently return nothing rather than fail.
 */
export const AUDIT_ACTIONS = [
  "USER_BANNED",
  "USER_UNBANNED",
  "USER_PASSWORD_RESET",
  "USER_ROLE_CHANGED",
  "USER_AREA_ASSIGNED",
  "USER_AREA_CLEARED",
  "USER_WALLET_CLEARED",
  "AREA_CREATED",
  "AREA_UPDATED",
  "AREA_DEACTIVATED",
  "AREA_REACTIVATED",
] as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[number];

/** `USER_ROLE_CHANGED` → `Role changed`. */
export const formatAuditAction = (action: string) => {
  const withoutPrefix = action.replace(/^(USER|AREA)_/, "");
  const words = withoutPrefix.toLowerCase().replace(/_/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
};

/** Destructive actions get a red pill; the rest read as ordinary changes. */
export const auditActionTone = (action: string): "destructive" | "warning" | "muted" => {
  if (action === "USER_BANNED" || action === "AREA_DEACTIVATED") return "destructive";
  if (
    action === "USER_ROLE_CHANGED" ||
    action === "USER_PASSWORD_RESET" ||
    action === "USER_WALLET_CLEARED"
  ) {
    return "warning";
  }
  return "muted";
};
