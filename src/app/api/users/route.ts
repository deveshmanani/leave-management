import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/permissions/rbac";
import { getAllUsers } from "@/services/users.service";
import type { ApiResponse, User } from "@/types";

export async function GET(): Promise<NextResponse<ApiResponse<User[]>>> {
  try {
    const { session, error } = await requireAdmin();

    if (error || !session) {
      const status = error === "Forbidden" ? 403 : 401;
      return NextResponse.json(
        { success: false, error: error ?? "Unauthorized" },
        { status }
      );
    }

    const users = await getAllUsers();

    return NextResponse.json({ success: true, data: users });
  } catch (err) {
    console.error("[API /api/users] Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
