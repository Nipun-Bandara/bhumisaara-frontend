import { Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TxHashBadgeProps {
  transactionHash?: string;
  /** Reacts to a `group` hover on an ancestor (e.g. a table row) when set. */
  groupHover?: boolean;
}

export default function TxHashBadge({ transactionHash, groupHover = false }: TxHashBadgeProps) {
  if (!transactionHash) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full font-mono text-xs transition-colors",
          groupHover && "group-hover:bg-primary/10 group-hover:text-primary"
        )}
      >
        <LinkIcon className="w-3 h-3" /> Polygon Amoy
      </span>
    );
  }

  return (
    <a
      href={`https://amoy.polygonscan.com/tx/${transactionHash}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary px-2.5 py-1 rounded-full font-mono text-xs transition-colors"
      title={transactionHash}
    >
      <LinkIcon className="w-3 h-3" />
      {`${transactionHash.substring(0, 6)}...${transactionHash.substring(transactionHash.length - 4)}`}
    </a>
  );
}
