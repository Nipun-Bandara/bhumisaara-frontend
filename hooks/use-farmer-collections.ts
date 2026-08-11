"use client";

import { useCallback, useEffect, useState } from "react";
import { isAxiosError } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import apiPaths from "@/utils/apiPaths";
import type { DistributionRecord } from "@/lib/distribution";

const describeError = (error: unknown, fallback: string) => {
  if (isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
};

/**
 * Handovers the signed-in farmer has received, newest first.
 * <p>
 * Shared by the farmer dashboard and the application history page so the two
 * can't drift — both read the same burn-backed records.
 */
export function useFarmerCollections() {
  const [collections, setCollections] = useState<DistributionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadCollections = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const response = await axiosInstance.get<DistributionRecord[]>(apiPaths.distributions.farmer);
      setCollections(response.data || []);
    } catch (error) {
      setLoadError(describeError(error, "Could not load your collections."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  return { collections, isLoading, loadError, refetch: loadCollections };
}

export default useFarmerCollections;
