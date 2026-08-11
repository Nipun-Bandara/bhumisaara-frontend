"use client";

import { useApiList } from "@/hooks/use-api-resource";
import apiPaths from "@/utils/apiPaths";
import type { Sack } from "@/lib/distribution";

/**
 * Every sack of one batch, in label order.
 *
 * @param batchId null until a batch is picked — the request is skipped until then.
 */
export function useBatchSacks(batchId: number | null) {
  return useApiList<Sack>(
    ["sacks", "batch", batchId],
    batchId === null ? apiPaths.sacks.byBatch(0) : apiPaths.sacks.byBatch(batchId),
    {
      enabled: batchId !== null,
      errorMessage: "Could not load the sacks for this batch.",
    }
  );
}

export default useBatchSacks;
