import { Hono } from "hono";
import { Head } from "../components/head";
import { pageJwt } from "../../middlewares";

const path = "/start-club";
export const startClubPage = new Hono().use(path, pageJwt).get(path, (c) => {
  return c.html(
    <html>
      <Head />
      <body>
        <nav>
          <a href="/">Home</a>
        </nav>
        <header>
          <h1>Start Club</h1>
        </header>
        <form action="/api/private/start-club" method="post">
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
