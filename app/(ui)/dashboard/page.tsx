"use client";

import { useAuth } from "@/context/AuthContext";
import FarmerDashboard from "@/components/farmer/FarmerDashboard";
import GovermentDashboard from "@/components/goverment/GovermentDashboard";
import AgrarianDashboard from "@/components/agrarian-officer/AgrarianDashboard";
import DealerDashboard from "@/components/private-dealer/DealerDashboard";
import OrganicProducerDashboard from "@/components/organic-producer/OrganicProducerDashboard";


export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // Handled by layout loader
  }

  // Switchboard pattern: Render completely different trees based on role
  if (user?.role === "FARMER") {
    return <FarmerDashboard />;
  }

  if (user?.role === "SYSTEM_ADMIN") {
    return <AdminDashboard />;
  }

  if (user?.role === "GOVERNMENT_ADMIN") {
    return <GovermentDashboard />;
  }

  if (user?.role === "AGRARIAN_SERVICE_OFFICER") {
    return <AgrarianDashboard />;
  }

  if (user?.role === "PRIVATE_AGRO_DEALER") {
    return <DealerDashboard />;
  }

  if (user?.roles.includes("ORGANIC_FERTILIZER_PRODUCER")) {
    return <OrganicProducerDashboard />;
  }

  // Fallback
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Welcome toBhumiSaara</h1>
      <p className="text-base text-muted-foreground">Your role is not recognized yet.</p>
    </div>
  );
}

// Inline role-specific components (to avoid creating many files right now)


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


