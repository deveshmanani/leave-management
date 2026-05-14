"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LeaveForm } from "./leave-form";
import type { User } from "@/types";

interface LeaveManagementDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLeaveUpdated: (
    email: string,
    newRegular: number,
    newSick: number
  ) => void;
}

export function LeaveManagementDialog({
  user,
  open,
  onOpenChange,
  onLeaveUpdated,
}: LeaveManagementDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Leave</DialogTitle>
          <DialogDescription>
            Update leave balance for{" "}
            <span className="font-medium text-foreground">{user.name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4 grid grid-cols-3 gap-3 rounded-lg border bg-muted/50 p-3 text-center text-sm">
          <div>
            <p className="text-muted-foreground">Vacation</p>
            <p className="text-lg font-bold">{user.regularLeave}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Sick</p>
            <p className="text-lg font-bold">{user.sickLeave}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total</p>
            <p className="text-lg font-bold">
              {user.regularLeave + user.sickLeave}
            </p>
          </div>
        </div>

        <LeaveForm
          user={user}
          onSuccess={(newRegular, newSick) => {
            onLeaveUpdated(user.email, newRegular, newSick);
          }}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
