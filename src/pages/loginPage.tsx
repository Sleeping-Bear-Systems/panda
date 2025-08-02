import { Hono } from "hono";
import { Head } from "../components/head";

export function mapLoginPage(): Hono {
  const app = new Hono();

  app.get("/login", (c) => {
    return c.html(
      <html>
        <Head />
        <body>
          <nav>
            <a href="/home">Home</a>
          </nav>
          <h1>Login</h1>
          <form action="/api/public/login" method="post">
            <label for="username">Username</label>
            <input name="username" type="text" required />
            <label for="password">Password</label>
            <input name="password" type="password" required />
            <button type="submit">Submit</button>
          </form>
        </body>
      </html>,
    );
  });
  return app;
}
