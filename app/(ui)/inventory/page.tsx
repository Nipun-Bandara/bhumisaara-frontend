"use client";

import { useAuth } from "@/context/AuthContext";
import SellerListings from "@/components/seller/SellerListings";

/**
 * The seller's listings management screen.
 *
 * This route used to render `DealerInventory`, a static mock-up of stock the
 * backend never stored. It now drives real `product_listings` rows and is open
 * to both seller roles rather than dealers alone — an organic producer needs
 * exactly the same screen, and the organic flag is set server-side from the
 * caller's role.
 */
export default function InventoryPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (
    user?.role === "PRIVATE_AGRO_DEALER" ||
    user?.role === "ORGANIC_FERTILIZER_PRODUCER"
  ) {
    return <SellerListings />;
  }

  // Fallback for other roles
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-foreground">My Listings</h1>
      <p className="text-base text-muted-foreground">
        Only agro-dealers and organic producers manage marketplace listings.
      </p>
    </div>
  );
}
