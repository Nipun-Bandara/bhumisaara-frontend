"use client";

import { useMemo } from "react";
import { useReadContract, useActiveAccount } from "thirdweb/react";
import { balanceOf } from "thirdweb/extensions/erc1155";
import { contract } from "@/lib/contract";
import { useApiList, useApiResource } from "@/hooks/use-api-resource";
import apiPaths from "@/utils/apiPaths";
import type {
  CreditBalance,
  CreditIssuance,
  CreditReconciliation,
  EligibleFarmer,
} from "@/lib/marketplace";

/** Seasons the admin may issue credits against. */
export function useCreditSeasons() {
  return useApiList<string>(["credits", "seasons"], apiPaths.credits.seasons, {
    errorMessage: "Could not load the season list.",
  });
}

/** Every farmer, annotated with whether this season's credits already reached them. */
export function useEligibleFarmers(season: string | null) {
  return useApiList<EligibleFarmer>(
    ["credits", "eligible-farmers", season],
    season ? apiPaths.credits.eligibleFarmers(season) : "",
    {
      enabled: Boolean(season),
      errorMessage: "Could not load the farmer list.",
    }
  );
}

/** Every issuance nationally — the treasury's mint ledger. */
export function useCreditIssuances() {
  return useApiList<CreditIssuance>(["credits", "issuances"], apiPaths.credits.issuances, {
    errorMessage: "Could not load the credit issuance ledger.",
  });
}

/** The signed-in farmer's credit position, from the Postgres ledger. */
export function useMyCreditBalance() {
  return useApiResource<CreditBalance>(["credits", "balance"], apiPaths.credits.balance, {
    errorMessage: "Could not load your credit balance.",
  });
}

/** Issued vs redeemed vs still held. A non-zero discrepancy is an anomaly. */
export function useCreditReconciliation(season?: string) {
  return useApiResource<CreditReconciliation>(
    ["credits", "reconciliation", season ?? "all"],
    apiPaths.credits.reconciliation(season),
    { errorMessage: "Could not load the credit reconciliation." }
  );
}

/**
 * The connected wallet's real on-chain credit balance for one season token.
 *
 * The backend has no web3 client — every chain interaction in this app is
 * signed and read in the browser — so the ledger figure from
 * `useMyCreditBalance` is Postgres' opinion and this is the chain's. Showing
 * both is deliberate: a gap between them means credits moved off-platform.
 *
 * Only the most recent season is read. A farmer holding several seasons spends
 * the newest first, which is the one the marketplace quotes against.
 */
export function useOnChainCreditBalance(tokenId: string | null | undefined) {
  const account = useActiveAccount();

  const parsedTokenId = useMemo(() => {
    if (!tokenId) return null;
    try {
      return BigInt(tokenId);
    } catch {
      // A non-numeric token id can't be read on-chain; the ledger figure stands alone.
      return null;
    }
  }, [tokenId]);

  const { data, isLoading } = useReadContract(balanceOf, {
    contract,
    owner: account?.address ?? "0x0000000000000000000000000000000000000000",
    // Placeholder while nothing is selected; the query is disabled anyway.
    tokenId: parsedTokenId ?? BigInt(0),
    queryOptions: { enabled: Boolean(account?.address && parsedTokenId !== null) },
  });

  return {
    /** Null while unread or unreadable — never silently rendered as zero. */
    balance: data === undefined ? null : Number(data),
    isLoading: isLoading && Boolean(account?.address && parsedTokenId !== null),
  };
}
