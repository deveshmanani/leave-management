export const SHEET_NAMES = {
  USERS: "Users",
  LEAVE_HISTORY: "LeaveHistory",
} as const;

export const USER_COLUMNS = {
  USER_ID: 0,
  NAME: 1,
  EMAIL: 2,
  ROLE: 3,
  REGULAR_LEAVE: 4,
  SICK_LEAVE: 5,
  CREATED_AT: 6,
} as const;

export const HISTORY_COLUMNS = {
  HISTORY_ID: 0,
  USER_EMAIL: 1,
  LEAVE_TYPE: 2,
  CHANGE_AMOUNT: 3,
  ACTION_TYPE: 4,
  UPDATED_BY: 5,
  UPDATED_AT: 6,
} as const;

export const USERS_RANGE = `${SHEET_NAMES.USERS}!A:G`;
export const HISTORY_RANGE = `${SHEET_NAMES.LEAVE_HISTORY}!A:G`;
