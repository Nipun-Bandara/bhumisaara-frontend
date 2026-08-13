"use client";

import { useAuth } from "@/context/AuthContext";
import Marketplace from "@/components/farmer/Marketplace";

export default function MarketplacePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (user?.role === "FARMER") {
    return <Marketplace />;
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-foreground">Marketplace</h1>
      <p className="text-base text-muted-foreground">
        Only farmers can buy fertilizer with subsidy credits.
      </p>
    </div>
  );
}
