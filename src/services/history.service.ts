import { getSheetsClient, getSheetId } from "@/lib/sheets/client";
import {
  SHEET_NAMES,
  HISTORY_RANGE,
  HISTORY_COLUMNS,
} from "@/lib/sheets/constants";
import type { ActionType, LeaveHistory, LeaveType } from "@/types";

function rowToHistory(row: string[]): LeaveHistory {
  return {
    historyId: row[HISTORY_COLUMNS.HISTORY_ID] ?? "",
    userEmail: row[HISTORY_COLUMNS.USER_EMAIL] ?? "",
    leaveType: (row[HISTORY_COLUMNS.LEAVE_TYPE] as LeaveType) ?? "regular",
    changeAmount: parseFloat(row[HISTORY_COLUMNS.CHANGE_AMOUNT] ?? "0"),
    actionType: (row[HISTORY_COLUMNS.ACTION_TYPE] as ActionType) ?? "add",
    updatedBy: row[HISTORY_COLUMNS.UPDATED_BY] ?? "",
    updatedAt: row[HISTORY_COLUMNS.UPDATED_AT] ?? "",
  };
}

export async function getAllHistory(): Promise<LeaveHistory[]> {
  const sheets = getSheetsClient();
  const spreadsheetId = getSheetId();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: HISTORY_RANGE,
  });

  const rows = response.data.values;
  if (!rows || rows.length <= 1) return [];

  return rows
    .slice(1)
    .map(rowToHistory)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
}

export async function getHistoryByUser(
  email: string
): Promise<LeaveHistory[]> {
  const allHistory = await getAllHistory();
  return allHistory.filter((h) => h.userEmail === email);
}

export async function createHistoryEntry(params: {
  userEmail: string;
  leaveType: LeaveType;
  changeAmount: number;
  actionType: ActionType;
  updatedBy: string;
}): Promise<LeaveHistory> {
  const sheets = getSheetsClient();
  const spreadsheetId = getSheetId();

  const historyId = crypto.randomUUID();
  const now = new Date().toISOString();

  const newRow = [
    historyId,
    params.userEmail,
    params.leaveType,
    params.changeAmount.toString(),
    params.actionType,
    params.updatedBy,
    now,
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${SHEET_NAMES.LEAVE_HISTORY}!A:G`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [newRow] },
  });

  return {
    historyId,
    userEmail: params.userEmail,
    leaveType: params.leaveType,
    changeAmount: params.changeAmount,
    actionType: params.actionType,
    updatedBy: params.updatedBy,
    updatedAt: now,
  };
}
