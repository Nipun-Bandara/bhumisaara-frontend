"use client";

import { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import axiosInstance from "@/utils/axiosInstance";
import apiPaths from "@/utils/apiPaths";
import { describeApiError } from "@/utils/apiError";
import { formatKg } from "@/utils/formatters";
import { useBatches } from "@/hooks/use-batches";
import { useBatchSacks } from "@/hooks/use-batch-sacks";
import { Skeleton } from "@/components/ui/skeleton";
import type { Sack } from "@/lib/distribution";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Printer, QrCode } from "lucide-react";

/**
 * Only the label sheet reaches the printer — the sidebar, headers and controls
 * around it would otherwise waste a page and confuse the person labelling.
 */
const PRINT_STYLES = `
@media print {
  body * { visibility: hidden; }
  #sack-label-sheet, #sack-label-sheet * { visibility: visible; }
  #sack-label-sheet {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    padding: 0;
  }
  .sack-label { break-inside: avoid; page-break-inside: avoid; }
}
`;

export default function SackLabels() {
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");
  const [isBackfilling, setIsBackfilling] = useState(false);

  const { data: batches, isLoading: isBatchesLoading } = useBatches();

  const selectedBatch = useMemo(
    () => batches.find((batch) => String(batch.batchId) === selectedBatchId) ?? null,
    [batches, selectedBatchId]
  );

  const {
    data: sacks,
    isLoading: isSacksLoading,
    refetch: refetchSacks,
  } = useBatchSacks(selectedBatch?.batchId ?? null);

  const selectBatch = (batchId: string) => setSelectedBatchId(batchId);

  /** Batches minted before sacks existed have none until they're backfilled. */
  const handleBackfill = async () => {
    if (!selectedBatch) return;

    setIsBackfilling(true);
    const toastId = toast.loading("Generating sacks for this batch...");

    try {
      const response = await axiosInstance.post<Sack[]>(
        apiPaths.sacks.backfill(selectedBatch.batchId)
      );
      await refetchSacks();

      toast.dismiss(toastId);
      toast.success(`Generated ${response.data?.length ?? 0} sacks.`);
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Could not generate sacks.", {
        description: describeApiError(error, "Please check server connection."),
      });
    } finally {
      setIsBackfilling(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full w-full bg-background">
      <style>{PRINT_STYLES}</style>

      <main className="flex-grow px-4 md:px-8 max-w-7xl mx-auto w-full pb-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 print:hidden">
          <div>
            <h1 className="text-3xl font-bold text-primary">Sack Labels</h1>
            <p className="text-lg text-muted-foreground mt-1">
              Print a QR label for every sack so it can be scanned on handover.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => window.print()}
            disabled={sacks.length === 0}
            className="h-12 px-8 text-sm font-semibold shadow-md hover:shadow-lg rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Printer className="w-4 h-4" />
            Print Labels
          </Button>
        </div>

        <Card className="border-border shadow-sm print:hidden">
          <CardHeader className="border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <QrCode className="w-6 h-6" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">Select Batch</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 flex flex-col gap-3 max-w-xl">
            <Select
              value={selectedBatchId}
              onValueChange={(value) => selectBatch(value ? String(value) : "")}
              disabled={isBatchesLoading || batches.length === 0}
            >
              <SelectTrigger className="w-full h-14 bg-background text-base">
                <SelectValue>
                  {(value) => {
                    const batch = batches.find((item) => String(item.batchId) === String(value ?? ""));
                    return batch
                      ? `${batch.importerName} · ${batch.fertilizerType} · TK-${batch.tokenId}`
                      : isBatchesLoading
                        ? "Loading batches..."
                        : "Choose a batch";
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {batches.map((batch) => (
                  <SelectItem key={batch.batchId} value={String(batch.batchId)}>
                    {batch.importerName} · {batch.fertilizerType} · TK-{batch.tokenId} · {batch.volumeKg}kg
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedBatch && !isSacksLoading && sacks.length === 0 && (
              <div className="flex flex-col items-start gap-3">
                <p className="text-sm text-muted-foreground">
                  This batch has no sacks — it was minted before sacks were tracked.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackfill}
                  disabled={isBackfilling}
                  className="cursor-pointer"
                >
                  {isBackfilling ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Sacks Now"
                  )}
                </Button>
              </div>
            )}

            {selectedBatch && sacks.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {sacks.length} labels ·{" "}
                {formatKg(sacks.reduce((total, sack) => total + sack.weightKg, 0))} total
              </p>
            )}
          </CardContent>
        </Card>

        {/* The printable sheet */}
        <div id="sack-label-sheet">
          {isSacksLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 print:hidden">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-56 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {sacks.map((sack) => (
                // Literal black-on-white on purpose: these are printed labels,
                // and a scanner needs the same contrast whatever theme is on screen.
                <div
                  key={sack.sackId}
                  className="sack-label border border-black/60 rounded-lg p-3 flex flex-col items-center gap-2 bg-white text-black"
                >
                  {/* A quiet zone the scanner can lock onto, even on a smudged print. */}
                  <QRCodeSVG value={sack.serial} size={128} level="M" marginSize={2} />
                  <span className="font-mono text-sm font-semibold tracking-wide">{sack.serial}</span>
                  <span className="text-xs">
                    {selectedBatch?.fertilizerType} · {sack.weightKg}kg
                  </span>
                  <span className="text-[10px] uppercase tracking-wider">
                    BhumiSaara · Batch #{sack.batchId}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
