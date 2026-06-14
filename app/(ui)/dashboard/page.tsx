"use client";

import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // Handled by layout loader
  }

  // Switchboard pattern: Render completely different trees based on role
  if (user?.roles.includes("FARMER")) {
    return <FarmerDashboard />;
  }

  if (
    user?.roles.includes("SYSTEM_ADMIN") ||
    user?.roles.includes("GOVERNMENT_ADMIN")
  ) {
    return <AdminDashboard />;
  }

  if (user?.roles.includes("PRIVATE_AGRO_DEALER")) {
    return <DealerDashboard />;
  }

  // Fallback
  return (
    <div className="p-8 space-y-6">
      <h1 className="font-headline-lg text-headline-lg text-on-surface">Welcome to PohoraChain</h1>
      <p className="font-body-md text-on-surface-variant">Your role is not recognized yet.</p>
    </div>
  );
}

// Inline role-specific components (to avoid creating many files right now)
function FarmerDashboard() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="font-headline-lg text-headline-lg text-on-surface">Farmer Dashboard</h1>
      <div className="p-6 bg-surface-container rounded-xl border border-outline-variant">
        <h2 className="font-title-md text-title-md text-on-surface mb-2">Digital Passbook</h2>
        <p className="font-body-md text-on-surface-variant">View your fertilizer quotas and subsidy tokens.</p>
      </div>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="font-headline-lg text-headline-lg text-on-surface">Admin Dashboard</h1>
      <div className="p-6 bg-surface-container rounded-xl border border-outline-variant">
        <h2 className="font-title-md text-title-md text-on-surface mb-2">National Inventory</h2>
        <p className="font-body-md text-on-surface-variant">Audit real-time tracking across all agrarian centers.</p>
      </div>
    </div>
  );
}

function DealerDashboard() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="font-headline-lg text-headline-lg text-on-surface">Agro-Dealer Portal</h1>
      <div className="p-6 bg-surface-container rounded-xl border border-outline-variant">
        <h2 className="font-title-md text-title-md text-on-surface mb-2">Stock Management</h2>
        <p className="font-body-md text-on-surface-variant">Manage incoming shipments and farmer distributions.</p>
      </div>
    </div>
  );
}
