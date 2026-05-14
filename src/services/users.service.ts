import { getSheetsClient, getSheetId } from "@/lib/sheets/client";
import {
  SHEET_NAMES,
  USERS_RANGE,
  USER_COLUMNS,
} from "@/lib/sheets/constants";
import type { Role, User } from "@/types";

function rowToUser(row: string[]): User {
  return {
    userId: row[USER_COLUMNS.USER_ID] ?? "",
    name: row[USER_COLUMNS.NAME] ?? "",
    email: row[USER_COLUMNS.EMAIL] ?? "",
    role: (row[USER_COLUMNS.ROLE] as Role) ?? "user",
    regularLeave: parseFloat(row[USER_COLUMNS.REGULAR_LEAVE] ?? "0"),
    sickLeave: parseFloat(row[USER_COLUMNS.SICK_LEAVE] ?? "0"),
    createdAt: row[USER_COLUMNS.CREATED_AT] ?? "",
  };
}

export async function getAllUsers(): Promise<User[]> {
  const sheets = getSheetsClient();
  const spreadsheetId = getSheetId();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: USERS_RANGE,
  });

  const rows = response.data.values;
  if (!rows || rows.length <= 1) return [];

  return rows.slice(1).map(rowToUser);
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await getAllUsers();
  return users.find((u) => u.email === email) ?? null;
}

export async function createUser(user: {
  name: string;
  email: string;
  role?: Role;
}): Promise<User> {
  const sheets = getSheetsClient();
  const spreadsheetId = getSheetId();

  const existing = await getUserByEmail(user.email);
  if (existing) return existing;

  const userId = crypto.randomUUID();
  const now = new Date().toISOString();

  const newRow = [
    userId,
    user.name,
    user.email,
    user.role ?? "user",
    "0",
    "0",
    now,
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${SHEET_NAMES.USERS}!A:G`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [newRow] },
  });

  return {
    userId,
    name: user.name,
    email: user.email,
    role: user.role ?? "user",
    regularLeave: 0,
    sickLeave: 0,
    createdAt: now,
  };
}

export async function getUserRowIndex(email: string): Promise<number> {
  const sheets = getSheetsClient();
  const spreadsheetId = getSheetId();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: USERS_RANGE,
  });

  const rows = response.data.values;
  if (!rows) return -1;

  return rows.findIndex(
    (row) => row[USER_COLUMNS.EMAIL] === email
  );
}

export async function updateUserLeaveBalance(
  email: string,
  regularLeave: number,
  sickLeave: number
): Promise<boolean> {
  const sheets = getSheetsClient();
  const spreadsheetId = getSheetId();

  const rowIndex = await getUserRowIndex(email);
  if (rowIndex < 0) return false;

  const rowNumber = rowIndex + 1;

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${SHEET_NAMES.USERS}!E${rowNumber}:F${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[regularLeave.toString(), sickLeave.toString()]],
    },
  });

  return true;
}
