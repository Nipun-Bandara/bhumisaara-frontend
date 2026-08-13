"use client";

import AdminOnly from "@/components/admin/AdminOnly";
import AdminWallets from "@/components/admin/AdminWallets";

export default function AdminWalletsPage() {
  return (
    <AdminOnly>
      <AdminWallets />
    </AdminOnly>
  );
}
