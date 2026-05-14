import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireSelf } from "@/lib/permissions/rbac";
import { getAllHistory, getHistoryByUser } from "@/services/history.service";
import type { ApiResponse, LeaveHistory, Role } from "@/types";

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<LeaveHistory[]>>> {
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
    const isAdmin = (session.user.role as Role) === "admin";

    if (email) {
      if (!isAdmin && !requireSelf(session.user.email!, email)) {
        return NextResponse.json(
          {
            success: false,
            error: "Forbidden: cannot view other users' history",
          },
          { status: 403 }
        );
      }

      const history = await getHistoryByUser(email);
      return NextResponse.json({ success: true, data: history });
    }

    if (isAdmin) {
      const history = await getAllHistory();
      return NextResponse.json({ success: true, data: history });
    }

    const history = await getHistoryByUser(session.user.email!);
    return NextResponse.json({ success: true, data: history });
  } catch (err) {
    console.error("[API /api/history] Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch leave history" },
      { status: 500 }
    );
  }
}
