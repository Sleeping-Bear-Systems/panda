import { Hono } from "hono";

export function mapLoginPage(): Hono {
  const app = new Hono();

  app.get("/login", (c) => {
    return c.html(
      <html>
        <nav>
          <a href="index.html">Home</a>
        </nav>
        <h1>Login</h1>
        <form action="/api/users/login" method="post">
          <label for="username">Username</label>
          <input name="username" type="text" required />
          <label for="password">Password</label>
          <input name="password" type="password" required />
          <button type="submit">Submit</button>
        </form>
      </html>,
    );
  });
  return app;
}
