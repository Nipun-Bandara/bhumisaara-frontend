/**
 * Shared shapes for the fertilizer request workflow. The farmer screens
 * (components/farmer/ApplicationForm.tsx, ApplicationsHistory.tsx) and the
 * officer review queue (components/agrarian-officer/RequestApprovals.tsx) read
 * the same FertilizerRequestResponseDTO off the backend, so the type lives here
 * rather than in either role's folder.
 */

export type RequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  // Set by the officer → farmer handover once some, then all, of the approved
  // amount has physically changed hands.
  | "PARTIALLY_COLLECTED"
  | "COLLECTED";

export interface FertilizerRequest {
  requestId: number;
  farmerId: number;
  farmerUsername: string;
  areaName: string | null;
  district: string | null;
  season: string;
  fertilizerType: string;
  requestedKg: number;
  approvedKg: number | null;
  /** How much of `approvedKg` has physically been handed over so far. */
  collectedKg: number;
  status: RequestStatus;
  reviewedByOfficerId: number | null;
  reviewedByOfficerUsername: string | null;
  reviewedAt: string | null;
  // Collection fields — the backend leaves these null; nothing writes them yet.
  batchId: number | null;
  sackSerial: string | null;
  burnTxHash: string | null;
  collectedAt: string | null;
  createdAt: string;
}

/** Kept in sync with the types MintBatchForm can mint. */
export const FERTILIZER_TYPES = [
  { value: "Urea", label: "Urea (46% Nitrogen)" },
  { value: "MOP", label: "MOP (Muriate of Potash)" },
  { value: "TSP", label: "TSP (Triple Super Phosphate)" },
];

/**
 * Sri Lanka runs two cultivation seasons: Maha spans the turn of the year,
 * Yala sits inside it. Derived from the current year so the list never goes stale.
 */
export const buildSeasonOptions = (): string[] => {
  const year = new Date().getFullYear();
  return [
    `Maha ${year - 1}/${year}`,
    `Yala ${year}`,
    `Maha ${year}/${year + 1}`,
    `Yala ${year + 1}`,
  ];
};
