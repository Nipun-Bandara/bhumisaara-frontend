import { CheckCircle, Clock, PackageOpen, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { RequestStatus } from "@/lib/fertilizerRequests";

type BadgeVariant = React.ComponentProps<typeof Badge>["variant"];

const VARIANTS: Record<RequestStatus, BadgeVariant> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "destructive",
  PARTIALLY_COLLECTED: "info",
  COLLECTED: "default",
};

const ICONS: Record<RequestStatus, React.ReactNode> = {
  PENDING: <Clock />,
  APPROVED: <CheckCircle />,
  REJECTED: <XCircle />,
  PARTIALLY_COLLECTED: <PackageOpen />,
  COLLECTED: <CheckCircle />,
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
    <Badge variant={VARIANTS[status]}>
      {ICONS[status]}
      {LABELS[status]}
    </Badge>
  );
}

export { LABELS as REQUEST_STATUS_LABELS };
