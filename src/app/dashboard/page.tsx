import type { Metadata } from "next";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard - HLMS",
};
import { getLeaveBalance } from "@/services/leaves.service";
import { getHistoryByUser, getAllHistory } from "@/services/history.service";
import { getAllUsers } from "@/services/users.service";
import { LeaveBalanceCards } from "@/components/shared/leave-balance-cards";
import { RecentActivity } from "@/components/shared/recent-activity";
import { AdminStats } from "@/components/admin/admin-stats";
import type { Role } from "@/types";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const email = session.user.email!;
  const isAdmin = (session.user.role as Role) === "admin";

  const [balance, history, users, allHistory] = await Promise.all([
    getLeaveBalance(email),
    getHistoryByUser(email),
    isAdmin ? getAllUsers() : Promise.resolve([]),
    isAdmin ? getAllHistory() : Promise.resolve([]),
  ]);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-lg font-semibold">
          Welcome back, {session.user.name?.split(" ")[0]}
        </h2>
        <p className="text-sm text-muted-foreground">
          {isAdmin
            ? "Here\u2019s an overview of your team"
            : "Here\u2019s your leave balance overview"}
        </p>
      </div>

      {isAdmin && <AdminStats users={users} />}

      {!isAdmin && (
        <LeaveBalanceCards
          balance={
            balance ?? { regularLeave: 0, sickLeave: 0, totalLeave: 0 }
          }
        />
      )}

      <RecentActivity
        history={isAdmin ? allHistory : history}
        limit={isAdmin ? 10 : 5}
      />
    </div>
  );
}
