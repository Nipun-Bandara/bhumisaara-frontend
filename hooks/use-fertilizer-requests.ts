"use client";

import { useApiList } from "@/hooks/use-api-resource";
import apiPaths from "@/utils/apiPaths";
import type { FertilizerRequest, RequestStatus } from "@/lib/fertilizerRequests";

/** The signed-in farmer's own applications, newest first. */
export function useMyFertilizerRequests() {
  return useApiList<FertilizerRequest>(["fertilizer-requests", "mine"], apiPaths.fertilizerRequests.mine, {
    errorMessage: "Could not load your applications.",
  });
}

/** The officer's review queue: pending requests from their area, oldest first. */
export function usePendingFertilizerRequests() {
  return useApiList<FertilizerRequest>(
    ["fertilizer-requests", "pending"],
    apiPaths.fertilizerRequests.pending,
    { errorMessage: "Could not load pending requests." }
  );
}

/**
 * Every request from the officer's area, newest first.
 *
 * @param status when "ALL", the filter is left off the request entirely.
 */
export function useAreaFertilizerRequests(status: RequestStatus | "ALL") {
  const path =
    status === "ALL"
      ? apiPaths.fertilizerRequests.area
      : `${apiPaths.fertilizerRequests.area}?status=${status}`;

  return useApiList<FertilizerRequest>(["fertilizer-requests", "area", status], path, {
    errorMessage: "Could not load the area's applications.",
  });
}
