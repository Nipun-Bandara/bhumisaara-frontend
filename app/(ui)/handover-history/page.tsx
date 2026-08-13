"use client";

import { useAuth } from "@/context/AuthContext";
import OwnDistribution from "@/components/agrarian-officer/OwnDistribution";
import OfficerHandoverHistory from "@/components/goverment/OfficerHandoverHistory";

export default function HandoverHistoryPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  // Switchboard: an officer sees the handovers they performed; a government
  // administrator picks any officer and audits theirs, disputes included.
  if (user?.role === "AGRARIAN_SERVICE_OFFICER") {
    return <OwnDistribution />;
  }

  if (user?.role === "GOVERNMENT_ADMIN" || user?.role === "SYSTEM_ADMIN") {
    return <OfficerHandoverHistory />;
  }

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-foreground">Access Denied</h1>
      <p className="text-base text-muted-foreground">
        You do not have permission to view handover history.
      </p>
    </div>
  );
}
