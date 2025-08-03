import { Hono } from "hono";
import { jwt, verify } from "hono/jwt";
import { Head } from "../components/head";
import { appConfig } from "../config";
import { getCookie } from "hono/cookie";

export function mapCreateClubPage(): Hono {
  const app = new Hono();

  const path = "/create-club";
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
          <nav>
            <a href="/home">Home</a>
          </nav>
          <header>
            <h1>Create Club</h1>
          </header>
          <form action="/api/private/create-club" method="post">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" />
            <label htmlFor="description">Description</label>
            <input id="description" name="description" type="text" />
            <button type="submit">Submit</button>
          </form>
        </body>
      </html>,
    );
  });
  return app;
}
