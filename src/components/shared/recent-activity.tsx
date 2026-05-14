import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { LeaveHistory } from "@/types";

interface RecentActivityProps {
  history: LeaveHistory[];
  limit?: number;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatChange(amount: number) {
  const prefix = amount > 0 ? "+" : "";
  return `${prefix}${amount}`;
}

function leaveTypeLabel(type: string) {
  return type === "regular" ? "vacation" : type;
}

export function RecentActivity({ history, limit = 5 }: RecentActivityProps) {
  const items = history.slice(0, limit);

  const hasMore = history.length > limit;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest leave balance changes</CardDescription>
        </div>
        {hasMore && (
          <Link
            href="/history"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>
        )}
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No activity yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Updated By
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.historyId}>
                    <TableCell className="text-sm">
                      {formatDate(item.updatedAt)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.leaveType === "sick" ? "destructive" : "secondary"
                        }
                        className="capitalize"
                      >
                        {leaveTypeLabel(item.leaveType)}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={
                        item.changeAmount > 0
                          ? "font-medium text-green-600 dark:text-green-400"
                          : "font-medium text-red-600 dark:text-red-400"
                      }
                    >
                      {formatChange(item.changeAmount)}
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                      {item.updatedBy}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
