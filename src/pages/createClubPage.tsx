import { Hono } from "hono";
import { Head } from "../components/head";

export function mapCreateClub(): Hono {
  const app = new Hono();

  app.get("/create-club", (c) => {
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
          <form>
            <label for="name">Name</label>
            <input id="name" type="text" />
            <label for="description">Description</label>
            <input id="description" type="text" />
            <button type="submit">Submit</button>
          </form>
        </body>
      </html>,
    );
  });
  return app;
}
