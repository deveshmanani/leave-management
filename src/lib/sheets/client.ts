import { google } from "googleapis";

function getAuthClient() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!privateKey || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
    throw new Error(
      "Missing GOOGLE_PRIVATE_KEY or GOOGLE_SERVICE_ACCOUNT_EMAIL environment variables"
    );
  }

  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

let sheetsInstance: ReturnType<typeof google.sheets> | null = null;

export function getSheetsClient() {
  if (!sheetsInstance) {
    const authClient = getAuthClient();
    sheetsInstance = google.sheets({ version: "v4", auth: authClient });
  }
  return sheetsInstance;
}

export function getSheetId() {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) {
    throw new Error("Missing GOOGLE_SHEET_ID environment variable");
  }
  return sheetId;
}
