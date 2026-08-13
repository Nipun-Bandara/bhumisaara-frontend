"use client";

import { useAuth } from "@/context/AuthContext";
import RedemptionClaimsQueue from "@/components/goverment/RedemptionClaimsQueue";

export default function RedemptionClaimsPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (user?.role === "GOVERNMENT_ADMIN" || user?.role === "SYSTEM_ADMIN") {
    return <RedemptionClaimsQueue />;
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-foreground">Redemption Claims</h1>
      <p className="text-base text-muted-foreground">
        Only the ministry reviews redemption claims. Sellers file theirs under Redemption.
      </p>
    </div>
  );
}
