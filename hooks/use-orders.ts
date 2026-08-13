"use client";

import { useApiList } from "@/hooks/use-api-resource";
import apiPaths from "@/utils/apiPaths";
import type { MarketOrder } from "@/lib/marketplace";

/** The signed-in farmer's own orders, newest first. */
export function useMyOrders() {
  return useApiList<MarketOrder>(["orders", "mine"], apiPaths.orders.mine, {
    errorMessage: "Could not load your orders.",
  });
}

/** Orders placed with the signed-in seller, newest first. */
export function useSellerOrders() {
  return useApiList<MarketOrder>(["orders", "seller"], apiPaths.orders.seller, {
    errorMessage: "Could not load your incoming orders.",
  });
}

/** Every order nationally — the ministry's marketplace ledger. */
export function useAllOrders() {
  return useApiList<MarketOrder>(["orders", "all"], apiPaths.orders.all, {
    errorMessage: "Could not load the marketplace ledger.",
  });
}
