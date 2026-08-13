"use client";

import AdminOnly from "@/components/admin/AdminOnly";
import AdminAreaCoverage from "@/components/admin/AdminAreaCoverage";

export default function AdminAreasPage() {
  return (
    <AdminOnly>
      <AdminAreaCoverage />
    </AdminOnly>
  );
}
