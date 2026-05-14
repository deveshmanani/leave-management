export type Role = "admin" | "user";

export type LeaveType = "regular" | "sick";

export type ActionType = "add" | "deduct" | "edit";

export interface User {
  userId: string;
  name: string;
  email: string;
  role: Role;
  regularLeave: number;
  sickLeave: number;
  createdAt: string;
}

export interface LeaveBalance {
  regularLeave: number;
  sickLeave: number;
  totalLeave: number;
}

export interface LeaveHistory {
  historyId: string;
  userEmail: string;
  leaveType: LeaveType;
  changeAmount: number;
  actionType: ActionType;
  updatedBy: string;
  updatedAt: string;
}

export interface UpdateLeaveParams {
  userEmail: string;
  leaveType: LeaveType;
  changeAmount: number;
  actionType: ActionType;
  updatedBy: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SessionUser {
  name: string;
  email: string;
  image?: string;
  role: Role;
}
