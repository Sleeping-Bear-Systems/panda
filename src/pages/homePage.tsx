import { Hono } from "hono";
import { Head } from "../components/head";
import { getCookie } from "hono/cookie";
import { jwt, verify } from "hono/jwt";
import { appConfig } from "../config";

export function mapHomePage(): Hono {
  const app = new Hono();

  const path = "/home";
  app.use(
    path,
    jwt({ secret: appConfig.JWT_SECRET, cookie: appConfig.jwtCookieName }),
    async (c, next) => {
      const token = getCookie(c, appConfig.jwtCookieName);
      if (!token) {
        return c.json("Unauthorized", 401);
      }
      const payload = await verify(token, appConfig.JWT_SECRET);
      if (!payload) {
        return c.json("Unauthorized", 401);
      }
      await next();
    },
  );
  app.get(path, (c) => {
    return c.html(
      <html>
        <Head />
        <body>
          <img src="/images/sleeping_bear_logo.svg" alt="Sleeping Bear Logo" />
          <nav>
            <a href="/about">About</a>
            <a href="/create-club">Create Club</a>
            <button
              hx-post="/api/public/logout"
              hx-include="none"
              hx-trigger="click"
              hx-on--after-request="window.location.href='/login'"
            >
              Logout
            </button>
          </nav>
          <h1>Welcome to Panda</h1>
          <p>Your app is running!</p>
        </body>
      </html>,
    );
  });

  return app;
}
