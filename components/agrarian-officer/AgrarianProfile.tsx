"use client";

import ProfileDetailsForm from "@/components/ProfileDetailsForm";

export default function AgrarianProfile() {
  return (
    <div className="flex flex-col min-h-full w-full bg-background">
      <main className="flex-grow px-4 md:px-8 max-w-8xl mx-auto w-full pb-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-primary">Officer Profile</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Manage your official profile and centre details. Your assigned area is set by a
            government administrator and is shown beside your name.
          </p>
        </div>

        <ProfileDetailsForm
          title="Official Details"
          description="Update your contact and agrarian centre information."
          addressLabel="Agrarian Centre / Address"
          addressPlaceholder="e.g. Kandy Agrarian Service Center, Kandy"
        />
      </main>
    </div>
  );
}
