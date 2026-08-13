"use client";

import { useAuth } from "@/context/AuthContext";
import CreditIssuance from "@/components/goverment/CreditIssuance";

export default function CreditIssuancePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (user?.role === "GOVERNMENT_ADMIN") {
    return <CreditIssuance />;
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-foreground">Issue Subsidy Credits</h1>
      <p className="text-base text-muted-foreground">
        Only a government administrator can fund a season&apos;s subsidy budget.
      </p>
    </div>
  );
}
