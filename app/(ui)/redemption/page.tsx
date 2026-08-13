"use client";

import { useAuth } from "@/context/AuthContext";
import SellerRedemption from "@/components/seller/SellerRedemption";

export default function RedemptionPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (
    user?.role === "PRIVATE_AGRO_DEALER" ||
    user?.role === "ORGANIC_FERTILIZER_PRODUCER"
  ) {
    return <SellerRedemption />;
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-foreground">Redemption Claims</h1>
      <p className="text-base text-muted-foreground">
        Only agro-dealers and organic producers redeem subsidy credits.
      </p>
    </div>
  );
}
