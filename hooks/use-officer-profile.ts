"use client";

import { useApiList, useApiResource } from "@/hooks/use-api-resource";
import apiPaths from "@/utils/apiPaths";
import type { Sack } from "@/lib/distribution";

export interface OfficerProfile {
  userId: number;
  username: string;
  email: string;
  areaId: number | null;
  areaName: string | null;
  district: string | null;
  isAssigned: boolean;
}

/** The signed-in officer's own profile, including the area they serve. */
export function useOfficerProfile() {
  return useApiResource<OfficerProfile>(["officer", "me"], apiPaths.officers.me, {
    errorMessage: "Could not load your officer profile.",
  });
}

/** The sacks physically in the signed-in officer's custody. */
export function useOfficerSacks() {
  return useApiList<Sack>(["sacks", "mine"], apiPaths.sacks.mine, {
    errorMessage: "Could not load your stock.",
  });
}
