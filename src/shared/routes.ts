/**
 * Page routes.
 */
export const PAGE_ROUTES = {
  ABOUT: "/about",
  ACCOUNTS: "/accounts",
  CHANGE_PASSWORD: "/change-password",
  CREATE_ACCOUNT: "/create-account",
  HOME: "/",
  LOGIN: "/login",
} as const;

/**
 * API routes.
 */
export const API_ROUTES = {
  CHANGE_PASSWORD: "/api/private/change-password",
  CREATE_ACCOUNT: "/api/public/create-account",
  LOGIN: "/api/public/login",
  LOGOUT: "/api/public/logout",
  PING: "/api/public/ping",
  ACCOUNTS: "/api/private/accounts",
} as const;
