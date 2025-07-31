import { Hono } from "hono";

export function mapAboutPage(): Hono {
  const app = new Hono();

  app.get("/about", (c) => {
    return c.html(
      <html>
        <img src="/images/sleeping_bear_logo.svg" alt="Sleeping Bear Logo" />
        <nav>
          <a href="/index.html">Home</a>
        </nav>
        <h1>About</h1>
        <div>
          Powered by&nbsp;
          <a
            href="https://event-driven-io.github.io/emmett/"
            target="_blank"
            rel="noopener"
          >
            Emmett
          </a>
        </div>
        <br />
        <div>Copyright &copy; {new Date().getFullYear()} Charles Farris</div>
      </html>,
    );
  });

  return app;
}
