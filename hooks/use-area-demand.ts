"use client";

import { useApiList } from "@/hooks/use-api-resource";
import apiPaths from "@/utils/apiPaths";
import type { AreaDemand } from "@/lib/distribution";

/** The government admin's distribution queue: outstanding demand per area. */
export function useAreaDemand() {
  return useApiList<AreaDemand>(["area-demand"], apiPaths.transfers.demand, {
    errorMessage: "Could not load area demand.",
  });
}

export default useAreaDemand;
