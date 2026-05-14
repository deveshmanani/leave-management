"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Search } from "lucide-react";
import { LeaveManagementDialog } from "./leave-management-dialog";
import type { User } from "@/types";

interface UserTableProps {
  users: User[];
}

export function UserTable({ users: initialUsers }: UserTableProps) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = users.filter((user) => {
    const q = search.toLowerCase();
    return (
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q)
    );
  });

  function handleManageLeave(user: User) {
    setSelectedUser(user);
    setDialogOpen(true);
  }

  function handleLeaveUpdated(
    email: string,
    newRegular: number,
    newSick: number
  ) {
    setUsers((prev) =>
      prev.map((u) =>
        u.email === email
          ? { ...u, regularLeave: newRegular, sickLeave: newSick }
          : u
      )
    );
    if (selectedUser?.email === email) {
      setSelectedUser((prev) =>
        prev
          ? { ...prev, regularLeave: newRegular, sickLeave: newSick }
          : null
      );
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
          aria-label="Search employees"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          {search ? "No users match your search" : "No users found"}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Regular</TableHead>
                <TableHead className="text-right">Sick</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground sm:hidden">
                        {user.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-sm sm:table-cell">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === "admin" ? "default" : "secondary"}
                      className="capitalize"
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {user.regularLeave}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {user.sickLeave}
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {user.regularLeave + user.sickLeave}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleManageLeave(user)}
                      aria-label={`Manage leave for ${user.name}`}
                    >
                      <Pencil className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <LeaveManagementDialog
        user={selectedUser}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onLeaveUpdated={handleLeaveUpdated}
      />
    </div>
  );
}
