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
      <h1 className="text-3xl font-bold text-foreground">Welcome to PohoraChain</h1>
      <p className="text-base text-muted-foreground">Your role is not recognized yet.</p>
    </div>
  );
}

// Inline role-specific components (to avoid creating many files right now)
function FarmerDashboard() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Farmer Dashboard</h1>
      <div className="p-6 bg-card text-card-foreground shadow-sm rounded-xl ">
        <h2 className="text-xl font-semibold mb-2">Digital Passbook</h2>
        <p className="text-base text-muted-foreground">View your fertilizer quotas and subsidy tokens.</p>
      </div>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
      <div className="p-6 bg-card text-card-foreground shadow-sm rounded-xl">
        <h2 className="text-xl font-semibold mb-2">National Inventory</h2>
        <p className="text-base text-muted-foreground">Audit real-time tracking across all agrarian centers.</p>
      </div>
    </div>
  );
}

function DealerDashboard() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Agro-Dealer Portal</h1>
      <div className="p-6 bg-card text-card-foreground shadow-sm rounded-xl">
        <h2 className="text-xl font-semibold mb-2">Stock Management</h2>
        <p className="text-base text-muted-foreground">Manage incoming shipments and farmer distributions.</p>
      </div>
    </div>
  );
}
