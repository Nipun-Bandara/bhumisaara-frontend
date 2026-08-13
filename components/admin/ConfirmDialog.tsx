"use client";

import type { ReactNode } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  /** Name the user and spell out the consequence — not "Are you sure?". */
  description: ReactNode;
  confirmLabel: string;
  pendingLabel?: string;
  onConfirm: () => void;
  isPending?: boolean;
  /** Blocks confirmation while a nested field is empty or invalid. */
  confirmDisabled?: boolean;
  /** Red framing for a ban, a wallet clear, a deactivation. */
  destructive?: boolean;
  /** Extra fields — the new role, the new password. */
  children?: ReactNode;
}

/**
 * The one confirmation used by every destructive administrative action.
 *
 * Never `window.confirm`: a native prompt cannot name the account being
 * changed, cannot say what happens next, and cannot show the extra field a
 * role change or password reset needs. Since these actions are irreversible
 * from the UI's point of view, saying exactly what they do is the point.
 */
export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  pendingLabel,
  onConfirm,
  isPending = false,
  confirmDisabled = false,
  destructive = false,
  children,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      // A dismiss while the request is in flight would leave the admin with no
      // idea whether it landed, so the dialog holds until it resolves.
      onOpenChange={(next) => {
        if (!isPending) onOpenChange(next);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <div className="flex items-start gap-3">
            {destructive && (
              <div className="p-2 rounded-full bg-destructive/10 text-destructive shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
            )}
            <div className="space-y-1.5">
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {children && <div className="space-y-4">{children}</div>}

        <DialogFooter>
          <Button
            variant="outline"
            size="lg"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant={destructive ? "destructive" : "default"}
            size="lg"
            onClick={onConfirm}
            disabled={isPending || confirmDisabled}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {pendingLabel ?? "Working..."}
              </>
            ) : (
              confirmLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
