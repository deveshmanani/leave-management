import type { ActionType, LeaveType } from "@/types";

const VALID_LEAVE_TYPES: LeaveType[] = ["regular", "sick"];
const VALID_ACTION_TYPES: ActionType[] = ["add", "deduct", "edit"];

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateLeaveType(leaveType: string): ValidationResult {
  if (!VALID_LEAVE_TYPES.includes(leaveType as LeaveType)) {
    return {
      valid: false,
      error: `Invalid leave type: "${leaveType}". Must be one of: ${VALID_LEAVE_TYPES.join(", ")}`,
    };
  }
  return { valid: true };
}

export function validateActionType(actionType: string): ValidationResult {
  if (!VALID_ACTION_TYPES.includes(actionType as ActionType)) {
    return {
      valid: false,
      error: `Invalid action type: "${actionType}". Must be one of: ${VALID_ACTION_TYPES.join(", ")}`,
    };
  }
  return { valid: true };
}

export function validateChangeAmount(amount: number): ValidationResult {
  if (typeof amount !== "number" || isNaN(amount)) {
    return { valid: false, error: "Change amount must be a valid number" };
  }

  if (amount <= 0) {
    return { valid: false, error: "Change amount must be greater than 0" };
  }

  if (amount % 0.5 !== 0) {
    return {
      valid: false,
      error: "Change amount must be a multiple of 0.5 (e.g., 0.5, 1, 1.5, 2)",
    };
  }

  return { valid: true };
}

export function validateBalanceNotNegative(
  currentBalance: number,
  deductAmount: number
): ValidationResult {
  if (currentBalance - deductAmount < 0) {
    return {
      valid: false,
      error: `Insufficient balance. Current: ${currentBalance}, Deduction: ${deductAmount}`,
    };
  }
  return { valid: true };
}

export function validateLeaveUpdate(params: {
  leaveType: string;
  actionType: string;
  changeAmount: number;
  currentBalance?: number;
}): ValidationResult {
  const leaveTypeResult = validateLeaveType(params.leaveType);
  if (!leaveTypeResult.valid) return leaveTypeResult;

  const actionTypeResult = validateActionType(params.actionType);
  if (!actionTypeResult.valid) return actionTypeResult;

  const amountResult = validateChangeAmount(params.changeAmount);
  if (!amountResult.valid) return amountResult;

  if (
    params.actionType === "deduct" &&
    params.currentBalance !== undefined
  ) {
    const balanceResult = validateBalanceNotNegative(
      params.currentBalance,
      params.changeAmount
    );
    if (!balanceResult.valid) return balanceResult;
  }

  return { valid: true };
}
