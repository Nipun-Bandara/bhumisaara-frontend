"use client";

import { useAuth } from "@/context/AuthContext";
import CreditOversight from "@/components/goverment/CreditOversight";

export default function CreditOversightPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (user?.role === "GOVERNMENT_ADMIN" || user?.role === "SYSTEM_ADMIN") {
    return <CreditOversight />;
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-foreground">Credit Oversight</h1>
      <p className="text-base text-muted-foreground">
        Only the ministry can view the national credit reconciliation.
      </p>
    </div>
  );
}
