"use client";

import { useApiList } from "@/hooks/use-api-resource";
import apiPaths from "@/utils/apiPaths";
import type { AdminTransfer } from "@/lib/distribution";

/** Admin → officer transfer ledger, newest first. */
export function useTransfers() {
  return useApiList<AdminTransfer>(["transfers"], apiPaths.transfers.history, {
    errorMessage: "Could not load the transfer ledger.",
  });
}

export default useTransfers;
