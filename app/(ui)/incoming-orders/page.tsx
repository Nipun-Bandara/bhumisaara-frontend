"use client";

import { useAuth } from "@/context/AuthContext";
import SellerOrders from "@/components/seller/SellerOrders";

/**
 * Both seller roles share one screen: an incoming order looks identical to a
 * dealer and a producer, and the organic difference lives on the listing.
 */
export default function IncomingOrdersPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (
    user?.role === "PRIVATE_AGRO_DEALER" ||
    user?.role === "ORGANIC_FERTILIZER_PRODUCER"
  ) {
    return <SellerOrders />;
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-foreground">Incoming Orders</h1>
      <p className="text-base text-muted-foreground">
        Only agro-dealers and organic producers receive marketplace orders.
      </p>
    </div>
  );
}
