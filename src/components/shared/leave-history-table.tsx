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
import type { LeaveHistory } from "@/types";

const PAGE_SIZE = 50;

interface LeaveHistoryTableProps {
  history: LeaveHistory[];
  showUser?: boolean;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatChange(amount: number) {
  const prefix = amount > 0 ? "+" : "";
  return `${prefix}${amount}`;
}

export function LeaveHistoryTable({
  history,
  showUser = false,
}: LeaveHistoryTableProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visibleItems = history.slice(0, visibleCount);
  const hasMore = visibleCount < history.length;

  if (history.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        No leave history found
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              {showUser && <TableHead>Employee</TableHead>}
              <TableHead>Leave Type</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Change</TableHead>
              <TableHead className="hidden sm:table-cell">Updated By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleItems.map((item) => (
              <TableRow key={item.historyId}>
                <TableCell>
                  <div className="text-sm">{formatDate(item.updatedAt)}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatTime(item.updatedAt)}
                  </div>
                </TableCell>
                {showUser && (
                  <TableCell className="text-sm">{item.userEmail}</TableCell>
                )}
                <TableCell>
                  <Badge
                    variant={
                      item.leaveType === "sick" ? "destructive" : "secondary"
                    }
                    className="capitalize"
                  >
                    {item.leaveType}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {item.actionType}
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

      {hasMore && (
        <div className="flex justify-center py-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setVisibleCount((prev) =>
                Math.min(prev + PAGE_SIZE, history.length),
              )
            }
          >
            Load more ({visibleCount} of {history.length})
          </Button>
        </div>
      )}

      {!hasMore && history.length > PAGE_SIZE && (
        <p className="text-center text-xs text-muted-foreground">
          Showing all {history.length} entries
        </p>
      )}
    </div>
  );
}
