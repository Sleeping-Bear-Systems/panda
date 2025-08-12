import type { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";

import { appConfig } from "./config";
import { logger } from "./logger";
import { ROUTES } from "./routes";

/** Page JWT middleware */
export const pageJwt = createMiddleware(async (c: Context, next: Next) => {
  try {
    const token = getCookie(c, appConfig.jwtCookieName);
    if (!token) {
      return c.redirect(ROUTES.LOGIN, 302);
    }
    const payload = await verify(token, appConfig.JWT_SECRET);
    if (!payload) {
      return c.redirect(ROUTES.LOGIN, 302);
    }
    c.set("jwtPayload", payload);
    await next();
  } catch (error) {
    logger.error(error);
    return c.json({}, 401);
  }
});
