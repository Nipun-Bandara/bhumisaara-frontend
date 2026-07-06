"use client";

import { useAuth } from "@/context/AuthContext";
import ImportHistory from "@/components/goverment/ImportHistory";

export default function ImportHistoryPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (user?.role === "GOVERNMENT_ADMIN") {
    return <ImportHistory />;
  }

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-foreground">Access Denied</h1>
      <p className="text-base text-muted-foreground">You do not have permission to view import history.</p>
    </div>
  );
}
