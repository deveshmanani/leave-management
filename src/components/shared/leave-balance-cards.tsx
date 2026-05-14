import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDays, Thermometer, Calculator } from "lucide-react";
import type { LeaveBalance } from "@/types";

interface LeaveBalanceCardsProps {
  balance: LeaveBalance;
}

const CARDS = [
  {
    key: "regular" as const,
    title: "Regular Leave",
    icon: CalendarDays,
    field: "regularLeave" as keyof LeaveBalance,
    description: "Available regular leave days",
  },
  {
    key: "sick" as const,
    title: "Sick Leave",
    icon: Thermometer,
    field: "sickLeave" as keyof LeaveBalance,
    description: "Available sick leave days",
  },
  {
    key: "total" as const,
    title: "Total Leave",
    icon: Calculator,
    field: "totalLeave" as keyof LeaveBalance,
    description: "Combined leave balance",
  },
];

export function LeaveBalanceCards({ balance }: LeaveBalanceCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {CARDS.map((card) => (
        <Card key={card.key}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className="size-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums">{balance[card.field]}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
