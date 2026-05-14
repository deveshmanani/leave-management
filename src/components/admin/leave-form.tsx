"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { ActionType, LeaveType, User } from "@/types";

interface LeaveFormProps {
  user: User;
  onSuccess: (newRegular: number, newSick: number) => void;
  onClose: () => void;
}

export function LeaveForm({ user, onSuccess, onClose }: LeaveFormProps) {
  const [isPending, startTransition] = useTransition();
  const [leaveType, setLeaveType] = useState<LeaveType>("regular");
  const [actionType, setActionType] = useState<ActionType>("add");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  function validate(): boolean {
    setError("");
    const num = parseFloat(amount);

    if (!amount || isNaN(num)) {
      setError("Please enter a valid amount");
      return false;
    }

    if (num <= 0) {
      setError("Amount must be greater than 0");
      return false;
    }

    if (num % 0.5 !== 0) {
      setError("Amount must be a multiple of 0.5");
      return false;
    }

    if (actionType === "deduct") {
      const current =
        leaveType === "regular" ? user.regularLeave : user.sickLeave;
      if (current - num < 0) {
        setError(
          `Cannot deduct ${num}. Current ${leaveType} balance is ${current}`
        );
        return false;
      }
    }

    return true;
  }

  function handleSubmit() {
    if (!validate()) return;

    startTransition(async () => {
      try {
        const res = await fetch("/api/leaves/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userEmail: user.email,
            leaveType,
            actionType,
            changeAmount: parseFloat(amount),
          }),
        });

        const data = await res.json();

        if (!data.success) {
          setError(data.error ?? "Failed to update leave");
          return;
        }

        toast.success(
          `Leave updated: ${actionType === "deduct" ? "-" : "+"}${amount} ${leaveType} for ${user.name}`
        );

        onSuccess(data.data.regularLeave, data.data.sickLeave);
        setAmount("");
        setError("");
        onClose();
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="leaveType">Leave Type</Label>
          <Select
            value={leaveType}
            onValueChange={(v) => setLeaveType(v as LeaveType)}
          >
            <SelectTrigger id="leaveType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="regular">Regular</SelectItem>
              <SelectItem value="sick">Sick</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="actionType">Action</Label>
          <Select
            value={actionType}
            onValueChange={(v) => setActionType(v as ActionType)}
          >
            <SelectTrigger id="actionType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="add">Add</SelectItem>
              <SelectItem value="deduct">Deduct</SelectItem>
              <SelectItem value="edit">Set to</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount (days)</Label>
        <Input
          id="amount"
          type="number"
          step="0.5"
          min="0.5"
          placeholder="e.g. 1, 0.5, 2.5"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setError("");
          }}
        />
      </div>

      <div aria-live="polite" aria-atomic="true">
        {error && (
          <p className="text-sm text-destructive" role="alert">{error}</p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isPending}>
          {isPending ? "Updating…" : "Update Leave"}
        </Button>
      </div>
    </div>
  );
}
