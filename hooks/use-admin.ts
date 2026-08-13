"use client";

import { useMemo } from "react";
import { useApiList, useApiResource } from "@/hooks/use-api-resource";
import apiPaths from "@/utils/apiPaths";
import type { Role } from "@/lib/navigation";
import type {
  AdminArea,
  AdminAuditLog,
  AdminUserDetail,
  AdminUserSummary,
  AdminWalletStatus,
  AreaCoverage,
  PageResponse,
  SystemHealth,
} from "@/lib/admin";

/**
 * The SYSTEM_ADMIN resources, one hook per endpoint, on the same
 * `use-api-resource` wrapper every other screen uses — so they share its
 * cache, its `{data,isLoading,error,refetch}` shape and its error messages.
 */

export interface AdminUserFilters {
  role?: Role | null;
  areaId?: number | null;
  isBanned?: boolean | null;
  search?: string;
  page?: number;
  size?: number;
}

/**
 * Builds the query string and, from the same inputs, the react-query key.
 * They have to move together: a key that ignores a filter would serve the
 * previous filter's rows from cache.
 */
const buildQuery = (params: Record<string, string | number | boolean | null | undefined>) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      search.set(key, String(value));
    }
  });
  return search.toString();
};

/** The paginated user directory. Filters are applied server-side. */
export function useAdminUsers(filters: AdminUserFilters) {
  const { role, areaId, isBanned, search, page = 0, size = 25 } = filters;

  const query = useMemo(
    () => buildQuery({ role, areaId, isBanned, search: search?.trim(), page, size }),
    [role, areaId, isBanned, search, page, size]
  );

  return useApiResource<PageResponse<AdminUserSummary>>(
    ["admin", "users", query],
    apiPaths.admin.users(query),
    { errorMessage: "Could not load the user directory." }
  );
}

/** One account with the activity counts an admin should read before acting. */
export function useAdminUser(userId: number | null) {
  return useApiResource<AdminUserDetail>(
    ["admin", "user", userId],
    userId ? apiPaths.admin.user(userId) : "",
    {
      enabled: userId !== null,
      errorMessage: "Could not load this user.",
    }
  );
}

/** Every area with its serving officer, or the vacancy and what it costs. */
export function useAreaCoverage() {
  return useApiList<AreaCoverage>(["admin", "area-coverage"], apiPaths.admin.areaCoverage, {
    errorMessage: "Could not load area coverage.",
  });
}

/** Every area, deactivated ones included — `GET /areas` hides those. */
export function useAdminAreas() {
  return useApiList<AdminArea>(["admin", "areas"], apiPaths.admin.areas, {
    errorMessage: "Could not load areas.",
  });
}

/** Wallet link status across the platform. */
export function useAdminWallets(unlinkedOnly: boolean) {
  return useApiList<AdminWalletStatus>(
    ["admin", "wallets", unlinkedOnly],
    apiPaths.admin.wallets(unlinkedOnly),
    { errorMessage: "Could not load wallet status." }
  );
}

/** The operational warning summary. Every count reads healthy at zero. */
export function useSystemHealth() {
  return useApiResource<SystemHealth>(["admin", "health"], apiPaths.admin.health, {
    errorMessage: "Could not load the system health summary.",
  });
}

export interface AuditLogFilters {
  actorUserId?: number | null;
  action?: string | null;
  /** `YYYY-MM-DD` from a date input; widened to cover the whole day below. */
  from?: string;
  to?: string;
  page?: number;
  size?: number;
}

/** The append-only audit trail, newest first. */
export function useAuditLogs(filters: AuditLogFilters) {
  const { actorUserId, action, from, to, page = 0, size = 25 } = filters;

  const query = useMemo(
    () =>
      buildQuery({
        actorUserId,
        action,
        // A date input gives a bare day. The backend compares timestamps, so
        // an unwidened `to` would exclude everything logged after midnight on
        // the last selected day.
        from: from ? `${from}T00:00:00` : undefined,
        to: to ? `${to}T23:59:59` : undefined,
        page,
        size,
      }),
    [actorUserId, action, from, to, page, size]
  );

  return useApiResource<PageResponse<AdminAuditLog>>(
    ["admin", "audit-logs", query],
    apiPaths.admin.auditLogs(query),
    { errorMessage: "Could not load the audit log." }
  );
}
