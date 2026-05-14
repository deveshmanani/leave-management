import { getUserByEmail, updateUserLeaveBalance } from "./users.service";
import { createHistoryEntry } from "./history.service";
import { validateLeaveUpdate } from "@/lib/validations/leave.validation";
import type { LeaveBalance, UpdateLeaveParams } from "@/types";

export async function getLeaveBalance(
  email: string
): Promise<LeaveBalance | null> {
  const user = await getUserByEmail(email);
  if (!user) return null;

  return {
    regularLeave: user.regularLeave,
    sickLeave: user.sickLeave,
    totalLeave: user.regularLeave + user.sickLeave,
  };
}

export async function updateLeaveBalance(
  params: UpdateLeaveParams
): Promise<{ success: boolean; error?: string; data?: LeaveBalance }> {
  const user = await getUserByEmail(params.userEmail);
  if (!user) {
    return { success: false, error: "User not found" };
  }

  const currentBalance =
    params.leaveType === "regular" ? user.regularLeave : user.sickLeave;

  const validation = validateLeaveUpdate({
    leaveType: params.leaveType,
    actionType: params.actionType,
    changeAmount: params.changeAmount,
    currentBalance:
      params.actionType === "deduct" ? currentBalance : undefined,
  });

  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  let newBalance: number;
  switch (params.actionType) {
    case "add":
      newBalance = currentBalance + params.changeAmount;
      break;
    case "deduct":
      newBalance = currentBalance - params.changeAmount;
      break;
    case "edit":
      newBalance = params.changeAmount;
      break;
  }

  const newRegular =
    params.leaveType === "regular" ? newBalance : user.regularLeave;
  const newSick =
    params.leaveType === "sick" ? newBalance : user.sickLeave;

  const [updated] = await Promise.all([
    updateUserLeaveBalance(params.userEmail, newRegular, newSick),
    createHistoryEntry({
      userEmail: params.userEmail,
      leaveType: params.leaveType,
      changeAmount:
        params.actionType === "deduct"
          ? -params.changeAmount
          : params.changeAmount,
      actionType: params.actionType,
      updatedBy: params.updatedBy,
    }),
  ]);

  if (!updated) {
    return { success: false, error: "Failed to update leave balance" };
  }

  return {
    success: true,
    data: {
      regularLeave: newRegular,
      sickLeave: newSick,
      totalLeave: newRegular + newSick,
    },
  };
}
