"use client";

import { useAuth } from "@/context/AuthContext";
import FarmerProfile from "@/components/farmer/FarmerProfile";
import GovermentProfile from "@/components/goverment/GovermentProfile";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  // Switchboard pattern: Render completely different trees based on role
  if (user?.roles.includes("FARMER")) {
    return <FarmerProfile />;
  }

  if (user?.roles.includes("SYSTEM_ADMIN")) {
    return <AdminProfile />;
  }

  if (user?.roles.includes("GOVERNMENT_ADMIN")) {
    return <GovermentProfile />;
  }

  if (user?.roles.includes("PRIVATE_AGRO_DEALER")) {
    return <DealerProfile />;
  }

  // Fallback
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
      <p className="text-base text-muted-foreground">Your role profile is not available yet.</p>
    </div>
  );
}

// Inline role-specific components as placeholders for now
function AdminProfile() {
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-foreground">Admin Profile</h1>
      <div className="p-6 bg-card border border-border shadow-sm rounded-xl">
        <p className="text-base text-muted-foreground">Admin profile details coming soon.</p>
      </div>
    </div>
  );
}

function DealerProfile() {
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-foreground">Dealer Profile</h1>
      <div className="p-6 bg-card border border-border shadow-sm rounded-xl">
        <p className="text-base text-muted-foreground">Agro-dealer profile details coming soon.</p>
      </div>
    </div>
  );
}
