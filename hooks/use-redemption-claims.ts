"use client";

import { useApiList } from "@/hooks/use-api-resource";
import apiPaths from "@/utils/apiPaths";
import type { RedemptionClaim } from "@/lib/marketplace";

/** The signed-in seller's own claims, newest first. */
export function useMyRedemptionClaims() {
  return useApiList<RedemptionClaim>(["redemption-claims", "mine"], apiPaths.redemptionClaims.mine, {
    errorMessage: "Could not load your redemption claims.",
  });
}

/** The government's review queue: awaiting a decision or a settling burn. */
export function usePendingRedemptionClaims() {
  return useApiList<RedemptionClaim>(
    ["redemption-claims", "pending"],
    apiPaths.redemptionClaims.pending,
    { errorMessage: "Could not load the claims queue." }
  );
}

/** Every claim ever filed, newest first. */
export function useAllRedemptionClaims() {
  return useApiList<RedemptionClaim>(["redemption-claims", "all"], apiPaths.redemptionClaims.all, {
    errorMessage: "Could not load the redemption ledger.",
  });
}
