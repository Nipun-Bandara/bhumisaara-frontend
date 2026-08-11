import { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useReadContract } from "thirdweb/react";
import { getNFTs } from "thirdweb/extensions/erc1155";
import type { NFT } from "thirdweb";
import { contract } from "@/lib/contract";
import axiosInstance from "@/utils/axiosInstance";
import apiPaths from "@/utils/apiPaths";

export type MintedNFT = Extract<NFT, { type: "ERC1155" }>;

export interface BackendBatch {
  tokenId: number;
  transactionHash?: string;
  [key: string]: unknown;
}

export interface MintedBatchRecord {
  tokenId: bigint;
  name: string;
  description: string;
  supply: bigint;
  transactionHash?: string;
}

/**
 * Combines on-chain ERC-1155 NFT batches with their off-chain metadata
 * (e.g. transactionHash) persisted in the Spring Boot backend, keyed by tokenId.
 * Backend batches are cached/shared via the QueryClient thirdweb's
 * ThirdwebProvider already puts in context, so every consumer of this hook
 * reads from (and refetches into) the same cache.
 */
export function useMintedBatches() {
  const {
    data: nfts,
    isLoading: isNFTsLoading,
    refetch: refetchNfts,
  } = useReadContract(getNFTs, { contract });

  const {
    data: backendBatches = [],
    refetch: refetchBatches,
  } = useQuery({
    queryKey: ["minted-batches"],
    queryFn: async () => {
      const response = await axiosInstance.get<BackendBatch[]>(apiPaths.batches.list);
      return response.data || [];
    },
  });

  const batchMap = useMemo(() => {
    const map = new Map<number, BackendBatch>();
    backendBatches.forEach((batch) => {
      if (batch.tokenId != null) {
        map.set(Number(batch.tokenId), batch);
      }
    });
    return map;
  }, [backendBatches]);

  const mintedNfts = useMemo<MintedNFT[]>(
    () => (nfts ?? []).filter((nft): nft is MintedNFT => nft.type === "ERC1155"),
    [nfts]
  );

  const records = useMemo<MintedBatchRecord[]>(
    () =>
      mintedNfts.map((nft) => ({
        tokenId: nft.id,
        name: nft.metadata?.name || "Unknown Batch",
        description: nft.metadata?.description || "No description",
        supply: nft.supply,
        transactionHash: batchMap.get(Number(nft.id))?.transactionHash,
      })),
    [mintedNfts, batchMap]
  );

  const refetch = useCallback(async () => {
    await Promise.all([refetchNfts(), refetchBatches()]);
  }, [refetchNfts, refetchBatches]);

  return {
    nfts: mintedNfts,
    isNFTsLoading,
    backendBatches,
    batchMap,
    records,
    refetch,
  };
}
