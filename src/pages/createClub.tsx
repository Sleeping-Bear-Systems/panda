import { Hono } from "hono";

export function mapCreateClub(): Hono {
  const app = new Hono();

  app.get("/create-club", (c) => {
    return c.html(
      <html>
        <nav>
          <a href="index.html">Home</a>
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
      </html>,
    );
  });
  return app;
}
