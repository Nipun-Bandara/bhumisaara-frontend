"use client";

import { useApiList } from "@/hooks/use-api-resource";
import apiPaths from "@/utils/apiPaths";
import type { DistributionRecord } from "@/lib/distribution";

/** Handovers the signed-in officer performed, newest first. */
export function useOfficerDistributions() {
  return useApiList<DistributionRecord>(["distributions", "officer"], apiPaths.distributions.officer, {
    errorMessage: "Could not load your distribution history.",
  });
}

/** Handovers the signed-in farmer received, newest first. */
export function useFarmerDistributions() {
  return useApiList<DistributionRecord>(["distributions", "farmer"], apiPaths.distributions.farmer, {
    errorMessage: "Could not load your collections.",
  });
}

/** Every handover nationally — the ministry's burn ledger. */
export function useAllDistributions() {
  return useApiList<DistributionRecord>(["distributions", "all"], apiPaths.distributions.all, {
    errorMessage: "Could not load the national burn ledger.",
  });
}
