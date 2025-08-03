import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";
import { appConfig } from "../config";
import { Context, Next } from "hono";

/** Page JWT middleware */
export const pageJwt = createMiddleware(async (c: Context, next: Next) => {
  const token = getCookie(c, appConfig.jwtCookieName);
  if (!token) {
    return c.redirect("/login", 302);
  }
  const payload = await verify(token, appConfig.JWT_SECRET);
  if (!payload) {
    return c.redirect("/login", 302);
  }
  await next();
});
