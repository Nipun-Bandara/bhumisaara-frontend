"use client";

import { useAuth } from "@/context/AuthContext";
import DealerInventory from "@/components/private-dealer/DealerInventory";

export default function InventoryPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (user?.roles.includes("PRIVATE_AGRO_DEALER")) {
    return <DealerInventory />;
  }

  // Fallback for other roles
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-foreground">Inventory</h1>
      <p className="text-base text-muted-foreground">
        You don&apos;t have access to inventory management.
      </p>
    </div>
  );
}
