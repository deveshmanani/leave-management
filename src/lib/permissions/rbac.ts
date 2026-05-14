import { auth } from "@/lib/auth/auth";
import type { Role } from "@/types";

export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    return { session: null, error: "Unauthorized" as const };
  }

  return { session, error: null };
}

export async function requireRole(allowedRoles: Role[]) {
  const { session, error } = await requireAuth();

  if (error || !session) {
    return { session: null, error: "Unauthorized" as const };
  }

  if (!allowedRoles.includes(session.user.role as Role)) {
    return { session: null, error: "Forbidden" as const };
  }

  return { session, error: null };
}

export async function requireAdmin() {
  return requireRole(["admin"]);
}

export function requireSelf(sessionEmail: string, targetEmail: string) {
  return sessionEmail === targetEmail;
}
