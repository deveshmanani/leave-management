import type { Metadata } from "next";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Manage Users - HLMS",
};
import { getAllUsers } from "@/services/users.service";
import { UserTable } from "@/components/admin/user-table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Role } from "@/types";

export default async function UsersPage() {
  const session = await auth();

  if (!session?.user || (session.user.role as Role) !== "admin") {
    redirect("/dashboard");
  }

  const users = await getAllUsers();

  return (
    <div className="p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>All Employees</CardTitle>
          <CardDescription>
            {users.length} employee{users.length !== 1 ? "s" : ""} registered
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserTable users={users} />
        </CardContent>
      </Card>
    </div>
  );
}
