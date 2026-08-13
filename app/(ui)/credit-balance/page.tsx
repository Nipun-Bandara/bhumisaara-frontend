"use client";

import { useAuth } from "@/context/AuthContext";
import CreditBalance from "@/components/farmer/CreditBalance";

export default function CreditBalancePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (user?.role === "FARMER") {
    return <CreditBalance />;
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-foreground">Subsidy Credits</h1>
      <p className="text-base text-muted-foreground">
        Only farmers hold subsidy credits. The ministry&apos;s view is under Credit Oversight.
      </p>
    </div>
  );
}
