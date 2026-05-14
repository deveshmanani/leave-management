import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/permissions/rbac";
import { requireSelf } from "@/lib/permissions/rbac";
import { getLeaveBalance } from "@/services/leaves.service";
import type { ApiResponse, LeaveBalance, Role } from "@/types";

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<LeaveBalance>>> {
  try {
    const { session, error } = await requireAuth();

    if (error || !session) {
      return NextResponse.json(
        { success: false, error: error ?? "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = request.nextUrl;
    const email = searchParams.get("email");

    const targetEmail = email ?? session.user.email!;
    const isAdmin = (session.user.role as Role) === "admin";

    if (!isAdmin && !requireSelf(session.user.email!, targetEmail)) {
      return NextResponse.json(
        { success: false, error: "Forbidden: cannot view other users' leave" },
        { status: 403 }
      );
    }

    const balance = await getLeaveBalance(targetEmail);

    if (!balance) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: balance });
  } catch (err) {
    console.error("[API /api/leaves] Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch leave balance" },
      { status: 500 }
    );
  }
}
