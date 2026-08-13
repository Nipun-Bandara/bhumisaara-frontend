"use client";

import AdminOnly from "@/components/admin/AdminOnly";
import AdminAuditLog from "@/components/admin/AdminAuditLog";

export default function AdminAuditLogPage() {
  return (
    <AdminOnly>
      <AdminAuditLog />
    </AdminOnly>
  );
}
