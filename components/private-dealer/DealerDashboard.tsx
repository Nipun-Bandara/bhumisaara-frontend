"use client";

import SellerDashboard from "@/components/seller/SellerDashboard";

/**
 * The agro-dealer's dashboard.
 *
 * A thin wrapper on purpose: dealers and organic producers see the same
 * storefront figures, and the one thing that differs — the organic conversion
 * rate — is a property of each listing, set server-side from the seller's role.
 * `app/(ui)/dashboard/page.tsx` still resolves this file per role, so the
 * switchboard there is unchanged.
 */
export default function DealerDashboard() {
  return <SellerDashboard />;
}
