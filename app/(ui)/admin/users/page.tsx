"use client";

import { Suspense } from "react";
import AdminOnly from "@/components/admin/AdminOnly";
import AdminUsers from "@/components/admin/AdminUsers";

export default function AdminUsersPage() {
  return (
    <AdminOnly>
      {/* AdminUsers keeps its filters in the URL, and `useSearchParams` needs a
          Suspense boundary above it or the route opts the whole page out of
          static rendering. */}
      <Suspense fallback={null}>
        <AdminUsers />
      </Suspense>
    </AdminOnly>
  );
}
