"use client";

import type { ReactNode } from "react";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

/**
 * Renders its children only for a SYSTEM_ADMIN.
 *
 * Cosmetic, not a security boundary — every `/admin/**` endpoint carries
 * `@PreAuthorize("hasRole('SYSTEM_ADMIN')")` and would refuse anyone else
 * regardless. This exists so a user who reaches the URL sees a sentence
 * instead of a screen full of failed requests.
 */
export default function AdminOnly({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // Handled by the layout loader
  }

  if (user?.role !== "SYSTEM_ADMIN") {
    return (
      <div className="flex flex-col min-h-full w-full bg-background">
        <main className="flex-grow px-4 md:px-8 max-w-7xl mx-auto w-full pb-8 space-y-4">
          <div className="flex flex-col items-center justify-center gap-3 text-center py-24">
            <div className="p-3 rounded-full bg-destructive/10 text-destructive">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Access denied</h1>
            <p className="text-base text-muted-foreground max-w-md">
              Platform administration is restricted to system administrators.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return <>{children}</>;
}
