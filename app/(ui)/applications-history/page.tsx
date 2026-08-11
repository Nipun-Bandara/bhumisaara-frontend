"use client";

import { useAuth } from "@/context/AuthContext";
import ApplicationsHistory from "@/components/farmer/ApplicationsHistory";
import AreaApplicationsHistory from "@/components/agrarian-officer/AreaApplicationsHistory";

export default function ApplicationsHistoryPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  // Switchboard: a farmer sees their own applications, an officer sees every
  // application from farmers in the area they're assigned to.
  if (user?.role === "FARMER") {
    return <ApplicationsHistory />;
  }

  if (user?.role === "AGRARIAN_SERVICE_OFFICER") {
    return <AreaApplicationsHistory />;
  }

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-foreground">Access Denied</h1>
      <p className="text-base text-muted-foreground">
        You do not have permission to view fertilizer subsidy applications.
      </p>
    </div>
  );
}
