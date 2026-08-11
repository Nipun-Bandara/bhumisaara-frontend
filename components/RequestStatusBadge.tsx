import { CheckCircle, Clock, PackageOpen, XCircle } from "lucide-react";
import type { RequestStatus } from "@/lib/fertilizerRequests";

const STYLES: Record<RequestStatus, string> = {
  PENDING: "bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-400",
  APPROVED: "bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-400",
  REJECTED: "bg-red-100 text-red-900 dark:bg-red-500/20 dark:text-red-400",
  PARTIALLY_COLLECTED: "bg-sky-100 text-sky-900 dark:bg-sky-500/20 dark:text-sky-400",
  COLLECTED: "bg-primary/10 text-primary",
};

const ICONS: Record<RequestStatus, React.ReactNode> = {
  PENDING: <Clock className="w-3.5 h-3.5" />,
  APPROVED: <CheckCircle className="w-3.5 h-3.5" />,
  REJECTED: <XCircle className="w-3.5 h-3.5" />,
  PARTIALLY_COLLECTED: <PackageOpen className="w-3.5 h-3.5" />,
  COLLECTED: <CheckCircle className="w-3.5 h-3.5" />,
};

const LABELS: Record<RequestStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  PARTIALLY_COLLECTED: "Partly collected",
  COLLECTED: "Collected",
};

/**
 * The status of a fertilizer request, rendered identically wherever it appears —
 * the farmer's history and the officer's area view previously carried two copies
 * of this that had to be kept in step by hand.
 */
export default function RequestStatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${STYLES[status]}`}
    >
      {ICONS[status]}
      {LABELS[status]}
    </span>
  );
}

export { LABELS as REQUEST_STATUS_LABELS };
