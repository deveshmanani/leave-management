"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Role } from "@/types";

interface HeaderProps {
  userName: string;
  userImage?: string | null;
  role: Role;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Header({ userName, userImage, role }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-end border-b bg-card px-4 md:px-6">
      <div className="flex items-center gap-3">
        <Badge variant={role === "admin" ? "default" : "secondary"} className="hidden sm:inline-flex">
          {role}
        </Badge>
        {userImage ? (
          <img
            src={userImage}
            alt={userName}
            referrerPolicy="no-referrer"
            className="size-8 rounded-full object-cover"
          />
        ) : (
          <Avatar className="size-8">
            <AvatarFallback className="text-xs">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </header>
  );
}
