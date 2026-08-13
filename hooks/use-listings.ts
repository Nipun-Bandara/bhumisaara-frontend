"use client";

import { useApiList } from "@/hooks/use-api-resource";
import apiPaths from "@/utils/apiPaths";
import type { ProductListing } from "@/lib/marketplace";

export interface ListingFilters {
  fertilizerType?: string;
  isOrganic?: boolean;
  isSubsidyEligible?: boolean;
  sellerId?: number;
}

/** Builds the querystring the backend's filters expect, omitting empty ones. */
const withFilters = (filters: ListingFilters) => {
  const params = new URLSearchParams();

  if (filters.fertilizerType) params.set("fertilizerType", filters.fertilizerType);
  if (filters.isOrganic !== undefined) params.set("isOrganic", String(filters.isOrganic));
  if (filters.isSubsidyEligible !== undefined) {
    params.set("isSubsidyEligible", String(filters.isSubsidyEligible));
  }
  if (filters.sellerId !== undefined) params.set("sellerId", String(filters.sellerId));

  const query = params.toString();
  return query ? `${apiPaths.listings.browse}?${query}` : apiPaths.listings.browse;
};

/** The marketplace: every ACTIVE listing, optionally filtered. */
export function useMarketplaceListings(filters: ListingFilters = {}) {
  return useApiList<ProductListing>(
    ["listings", "browse", filters],
    withFilters(filters),
    { errorMessage: "Could not load the marketplace." }
  );
}

/** The signed-in seller's own listings, whatever their status. */
export function useMyListings() {
  return useApiList<ProductListing>(["listings", "mine"], apiPaths.listings.mine, {
    errorMessage: "Could not load your listings.",
  });
}
