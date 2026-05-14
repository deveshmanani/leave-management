import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, CalendarDays, Thermometer } from "lucide-react";
import type { User } from "@/types";

interface AdminStatsProps {
  users: User[];
}

export function AdminStats({ users }: AdminStatsProps) {
  const totalUsers = users.length;
  const totalRegular = users.reduce((sum, u) => sum + u.regularLeave, 0);
  const totalSick = users.reduce((sum, u) => sum + u.sickLeave, 0);

  const stats = [
    {
      title: "Total Employees",
      value: totalUsers,
      icon: Users,
      description: "Registered in the system",
    },
    {
      title: "Vacation Leave Pool",
      value: totalRegular,
      icon: CalendarDays,
      description: "Total vacation leave across all employees",
    },
    {
      title: "Sick Leave Pool",
      value: totalSick,
      icon: Thermometer,
      description: "Total sick leave across all employees",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="size-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums">{stat.value}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
