import { Hono } from "hono";
import { deleteCookie } from "hono/cookie";

import { appConfig } from "../shared/config.js";
import { PAGE_ROUTES } from "../shared/routes.js";

/**
 * Logout API endpoint.
 */
export const logout = new Hono().post("/", (c) => {
  deleteCookie(c, appConfig.jwtCookieName);
  return c.redirect(PAGE_ROUTES.LOGIN);
});
