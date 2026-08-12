"use client";

import { useApiList } from "@/hooks/use-api-resource";
import apiPaths from "@/utils/apiPaths";
import type { PendingCollection } from "@/lib/distribution";

/** Approved requests awaiting collection in the calling officer's own area. */
export function usePendingCollections() {
  return useApiList<PendingCollection>(["pending-collections"], apiPaths.distributions.pending, {
    errorMessage: "Could not load pending collections.",
  });
}

export default usePendingCollections;
