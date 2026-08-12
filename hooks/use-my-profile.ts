"use client";

import { useApiResource } from "@/hooks/use-api-resource";
import apiPaths from "@/utils/apiPaths";
import type { Role } from "@/lib/navigation";

/** `ProfileResponseDTO` — the signed-in user's own account. */
export interface MyProfile {
  userId: number;
  username: string;
  email: string;
  role: Role | null;

  // Null until the user fills the profile in for the first time.
  fullName: string | null;
  address: string | null;
  contactNumber: string | null;

  // Set by other flows, shown read-only on the profile screen.
  walletAddress: string | null;
  areaId: number | null;
  areaName: string | null;
  district: string | null;

  createdAt: string;
}

/** The signed-in user's profile, whatever their role. */
export function useMyProfile() {
  return useApiResource<MyProfile>(["users", "me", "profile"], apiPaths.users.myProfile, {
    errorMessage: "Could not load your profile.",
  });
}

export default useMyProfile;
