"use client";

import { useAuth } from "@/context/AuthContext";
import RequestApprovals from "@/components/agrarian-officer/RequestApprovals";

export default function RequestApprovalsPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (user?.role === "AGRARIAN_SERVICE_OFFICER") {
    return <RequestApprovals />;
  }

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-foreground">Access Denied</h1>
      <p className="text-base text-muted-foreground">
        You do not have permission to review fertilizer requests.
      </p>
    </div>
  );
}
