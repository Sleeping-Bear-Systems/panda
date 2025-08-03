import { Hono } from "hono";
import { deleteCookie } from "hono/cookie";

import { appConfig } from "../shared/config";
import { ROUTES } from "../shared/routes";

/** Maps the logout endpoint. */
export const logout = new Hono().post("/", (c) => {
  deleteCookie(c, appConfig.jwtCookieName);
  return c.redirect(ROUTES.LOGIN);
});
