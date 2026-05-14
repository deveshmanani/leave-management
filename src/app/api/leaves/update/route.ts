import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/permissions/rbac";
import { updateLeaveBalance } from "@/services/leaves.service";
import { validateLeaveUpdate } from "@/lib/validations/leave.validation";
import type { ActionType, ApiResponse, LeaveBalance, LeaveType } from "@/types";

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<LeaveBalance>>> {
  try {
    const { session, error } = await requireAdmin();

    if (error || !session) {
      const status = error === "Forbidden" ? 403 : 401;
      return NextResponse.json(
        { success: false, error: error ?? "Unauthorized" },
        { status }
      );
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const userEmail = body.userEmail as string | undefined;
    const leaveType = body.leaveType as LeaveType | undefined;
    const changeAmount = body.changeAmount as number | undefined;
    const actionType = body.actionType as ActionType | undefined;

    if (!userEmail || !leaveType || changeAmount === undefined || !actionType) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: userEmail, leaveType, changeAmount, actionType",
        },
        { status: 400 }
      );
    }

    const validation = validateLeaveUpdate({
      leaveType,
      actionType,
      changeAmount: Number(changeAmount),
    });

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const result = await updateLeaveBalance({
      userEmail,
      leaveType,
      changeAmount: Number(changeAmount),
      actionType,
      updatedBy: session.user.email!,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (err) {
    console.error("[API /api/leaves/update] Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update leave balance" },
      { status: 500 }
    );
  }
}
