"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { useActiveAccount, TransactionButton } from "thirdweb/react";
import { burn } from "thirdweb/extensions/erc1155";
import { contract } from "@/lib/contract";
import axiosInstance from "@/utils/axiosInstance";
import apiPaths from "@/utils/apiPaths";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { QrCode, Flame, CheckCircle, Loader2 } from "lucide-react";

interface Batch {
  tokenId: number;
  transactionHash?: string;
  importerName?: string;
  fertilizerType?: string;
  // Reflects the volume recorded at mint time — the backend doesn't yet
  // track remaining stock separately, so this is treated as available stock.
  volumeKg: number;
  [key: string]: unknown;
}

interface PendingHandover {
  tokenId: number;
  amountKg: number;
  farmerId: string;
}

const QUICK_AMOUNTS_KG = [10, 25, 50];

export default function HandoverForm() {
  const account = useActiveAccount();
  const { user } = useAuth();

  const [batches, setBatches] = useState<Batch[]>([]);
  const [isBatchesLoading, setIsBatchesLoading] = useState(true);

  const [selectedTokenId, setSelectedTokenId] = useState<string>("");
  const [farmerId, setFarmerId] = useState("");
  const [amountKg, setAmountKg] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastHandover, setLastHandover] = useState<{ transactionHash: string; amountKg: number } | null>(null);

  // Snapshots the form values at the moment the burn transaction is prepared,
  // so the backend payload always matches what was actually burned on-chain
  // even if the form is edited while the transaction is still confirming.
  const pendingHandoverRef = useRef<PendingHandover | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchBatches = async () => {
      try {
        const response = await axiosInstance.get<Batch[]>(apiPaths.batches.save);
        if (!cancelled) {
          setBatches((response.data || []).filter((batch) => Number(batch.volumeKg) > 0));
        }
      } catch (err) {
        console.warn("Could not load active batches", err);
      } finally {
        if (!cancelled) setIsBatchesLoading(false);
      }
    };

    fetchBatches();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedBatch = useMemo(
    () => batches.find((batch) => String(batch.tokenId) === selectedTokenId),
    [batches, selectedTokenId]
  );

  const parsedAmountKg = Number(amountKg);
  const isFormValid = Boolean(
    selectedBatch &&
      farmerId.trim() &&
      amountKg &&
      Number.isInteger(parsedAmountKg) &&
      parsedAmountKg > 0 &&
      parsedAmountKg <= Number(selectedBatch.volumeKg)
  );

  const resetForm = () => {
    setSelectedTokenId("");
    setFarmerId("");
    setAmountKg("");
  };

  return (
    <Card className="border-border shadow-sm flex flex-col h-full">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold text-foreground">Digital Handover</CardTitle>
          <QrCode className="text-muted-foreground w-8 h-8" />
        </div>
      </CardHeader>
      <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
        <div className="flex flex-col gap-8">
          {/* Step 1: Batch selector */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold">1</span>
              Select Fertilizer Batch
            </label>
            <Select
              value={selectedTokenId}
              onValueChange={(value) => setSelectedTokenId(value ?? "")}
              disabled={isSaving || isBatchesLoading}
            >
              <SelectTrigger className="w-full h-14 bg-background text-base">
                <SelectValue placeholder={isBatchesLoading ? "Loading batches..." : "Choose a batch"} />
              </SelectTrigger>
              <SelectContent>
                {batches.map((batch) => (
                  <SelectItem key={batch.tokenId} value={String(batch.tokenId)}>
                    {batch.importerName || "Batch"} · TK-{batch.tokenId} · {batch.volumeKg}kg available
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!isBatchesLoading && batches.length === 0 && (
              <p className="text-xs text-muted-foreground">No active batches with remaining stock.</p>
            )}
          </div>

          {/* Step 2: Farmer */}
          <div className="flex flex-col gap-3">
            <label htmlFor="farmerId" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold">2</span>
              Farmer ID / Wallet Address
            </label>
            <Input
              id="farmerId"
              value={farmerId}
              onChange={(e) => setFarmerId(e.target.value)}
              placeholder="Scan or enter farmer ID / wallet address"
              disabled={isSaving}
              className="h-14 text-base bg-background"
            />
          </div>
        </div>

        <div className="flex flex-col gap-8 justify-between">
          {/* Step 3: Amount */}
          <div className="flex flex-col gap-3">
            <label htmlFor="amountKg" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold">3</span>
              Amount to Dispense (KG)
            </label>
            <div className="relative">
              <Input
                id="amountKg"
                type="number"
                min="1"
                step="1"
                value={amountKg}
                onChange={(e) => setAmountKg(e.target.value)}
                placeholder="Enter amount"
                disabled={isSaving}
                className="h-14 text-lg pr-12"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-medium text-muted-foreground">KG</span>
            </div>
            <div className="flex gap-2 mt-2">
              {QUICK_AMOUNTS_KG.map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant="outline"
                  disabled={isSaving}
                  onClick={() => setAmountKg(String(amount))}
                  className="flex-1 h-12 text-muted-foreground hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-colors"
                >
                  {amount}kg
                </Button>
              ))}
            </div>
            {selectedBatch && parsedAmountKg > Number(selectedBatch.volumeKg) && (
              <p className="text-xs text-destructive">Exceeds available stock ({selectedBatch.volumeKg}kg).</p>
            )}
          </div>

          {/* Action */}
          <div className="pt-6 border-t border-border mt-auto">
            {!account ? (
              <Button disabled className="w-full h-12 text-base opacity-75 cursor-not-allowed">
                Connect Wallet to Authorize
              </Button>
            ) : (
              <TransactionButton
                transaction={() => {
                  if (!selectedBatch) {
                    throw new Error("Select a batch before authorizing a handover.");
                  }

                  pendingHandoverRef.current = {
                    tokenId: selectedBatch.tokenId,
                    amountKg: parsedAmountKg,
                    farmerId: farmerId.trim(),
                  };

                  return burn({
                    contract,
                    account: account.address,
                    id: BigInt(selectedBatch.tokenId),
                    value: BigInt(parsedAmountKg),
                  });
                }}
                disabled={!isFormValid || isSaving}
                onTransactionConfirmed={async (receipt) => {
                  const pending = pendingHandoverRef.current;
                  if (!pending) return;

                  setIsSaving(true);
                  const toastId = toast.loading("Syncing handover with backend...");

                  try {
                    const payload = {
                      tokenId: pending.tokenId,
                      batchId: pending.tokenId,
                      farmerId: pending.farmerId,
                      officerId: user?.id ? Number(user.id) : 1,
                      amountDispensedKg: pending.amountKg,
                      burnTransactionHash: receipt.transactionHash,
                    };

                    await axiosInstance.post(apiPaths.handovers.record, payload);

                    setLastHandover({
                      transactionHash: receipt.transactionHash,
                      amountKg: pending.amountKg,
                    });

                    toast.dismiss(toastId);
                    toast.success("Handover recorded successfully!", {
                      description: `${pending.amountKg}kg dispensed | Tx: ${receipt.transactionHash.substring(0, 10)}...`,
                      icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
                    });

                    pendingHandoverRef.current = null;
                    resetForm();
                  } catch (error) {
                    toast.dismiss(toastId);
                    const description = isAxiosError(error)
                      ? error.response?.data?.message || error.message
                      : error instanceof Error
                        ? error.message
                        : "Please check server connection.";
                    toast.error("Tokens burned, but backend sync failed.", { description });
                  } finally {
                    setIsSaving(false);
                  }
                }}
                onError={(error) => {
                  toast.error("Blockchain burn transaction failed.", {
                    description: error?.message || "Transaction reverted or was rejected.",
                  });
                }}
                unstyled
                className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-[0.98]"
              >
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Syncing Handover...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Flame className="w-5 h-5" />
                    Authorize Handover
                  </span>
                )}
              </TransactionButton>
            )}
          </div>

          {/* Post-submission summary */}
          {lastHandover && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex flex-col gap-1">
              <span className="text-xs font-semibold text-primary uppercase tracking-wide flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" /> Last Handover Confirmed
              </span>
              <span className="text-sm text-foreground">{lastHandover.amountKg}kg dispensed</span>
              <a
                href={`https://amoy.polygonscan.com/tx/${lastHandover.transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-primary hover:underline break-all"
              >
                {lastHandover.transactionHash}
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
