import type { Metadata } from "next";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Leave History - HLMS",
};
import { getAllHistory, getHistoryByUser } from "@/services/history.service";
import { LeaveHistoryTable } from "@/components/shared/leave-history-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Role } from "@/types";

export default async function HistoryPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const isAdmin = (session.user.role as Role) === "admin";

  const history = isAdmin
    ? await getAllHistory()
    : await getHistoryByUser(session.user.email!);

  return (
    <div className="p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {isAdmin ? "All Leave Activity" : "Your Leave History"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LeaveHistoryTable history={history} showUser={isAdmin} />
        </CardContent>
      </Card>
    </div>
  );
}
