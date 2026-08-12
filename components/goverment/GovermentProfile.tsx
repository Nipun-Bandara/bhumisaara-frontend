"use client";

import ProfileDetailsForm from "@/components/ProfileDetailsForm";

export default function GovermentProfile() {
  return (
    <div className="flex flex-col min-h-full w-full bg-background">
      <main className="flex-grow px-4 md:px-8 max-w-8xl mx-auto w-full pb-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-primary">My Profile</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Manage the details shown against the batches you mint and the stock you distribute.
          </p>
        </div>

        <ProfileDetailsForm
          title="Official Details"
          description="Update your contact and department information."
          addressLabel="Department / Address"
          addressPlaceholder="e.g. Ministry of Agriculture, Battaramulla"
        />
      </main>
    </div>
  );
}
