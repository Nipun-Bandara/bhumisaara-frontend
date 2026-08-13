"use client";

import { useAuth } from "@/context/AuthContext";
import MyOrders from "@/components/farmer/MyOrders";

export default function MyOrdersPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (user?.role === "FARMER") {
    return <MyOrders />;
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
      <p className="text-base text-muted-foreground">
        Only farmers place marketplace orders. Sellers see theirs under Incoming Orders.
      </p>
    </div>
  );
}
