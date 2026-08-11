"use client";

import { useAuth } from "@/context/AuthContext";
import OfficerAssign from "@/components/goverment/OfficerAssign";

export default function OfficerAssignPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (user?.role === "GOVERNMENT_ADMIN" || user?.role === "SYSTEM_ADMIN") {
    return <OfficerAssign />;
  }

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-foreground">Access Denied</h1>
      <p className="text-base text-muted-foreground">You do not have permission to assign officers.</p>
    </div>
  );
}
