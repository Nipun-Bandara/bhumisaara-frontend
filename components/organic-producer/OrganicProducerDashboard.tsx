"use client";

import SellerDashboard from "@/components/seller/SellerDashboard";

/**
 * The organic producer's dashboard — the same storefront view as the dealer's.
 *
 * See `components/private-dealer/DealerDashboard.tsx` for why both roles share
 * one implementation rather than keeping two copies in step.
 */
export default function OrganicProducerDashboard() {
  return <SellerDashboard />;
}
