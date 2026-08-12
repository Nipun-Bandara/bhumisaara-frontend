"use client";

import { useApiList } from "@/hooks/use-api-resource";
import apiPaths from "@/utils/apiPaths";
import type { Batch } from "@/lib/distribution";

/** Every batch recorded in the registry, for admins and officers alike. */
export function useBatches() {
  return useApiList<Batch>(["batches"], apiPaths.batches.list, {
    errorMessage: "Could not load minted batches.",
  });
}

export default useBatches;
