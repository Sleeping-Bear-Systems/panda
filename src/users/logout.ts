import { Hono } from "hono";
import { deleteCookie } from "hono/cookie";
import { appConfig } from "../config";

/** Maps the logout endpoint. */
export function mapLogoutEndpoint(): Hono {
  const app = new Hono();
  app.post("/logout", (c) => {
    deleteCookie(c, appConfig.jwtCookieName);
    return c.redirect("/login");
  });
  return app;
}
