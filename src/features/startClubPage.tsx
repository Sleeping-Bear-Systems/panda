import { Hono } from "hono";
import { Head } from "../shared/head";
import { pageJwt } from "../shared/middlewares";
import { API_ROUTES, ROUTES } from "../shared/routes";

export const startClubPage = new Hono().use("/", pageJwt).get("/", (c) => {
  return c.html(
    <html>
      <Head />
      <body>
        <nav>
          <a href={ROUTES.HOME}>Home</a>
        </nav>
        <header>
          <h1>Start Club</h1>
        </header>
        <form action={API_ROUTES.START_CLUB} method="post">
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
