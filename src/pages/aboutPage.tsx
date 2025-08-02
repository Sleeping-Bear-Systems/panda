import { Hono } from "hono";
import { Head } from "../components/head";

export function mapAboutPage(): Hono {
  const app = new Hono();

  app.get("/about", (c) => {
    return c.html(
      <html>
        <Head />
        <body>
          <img src="/images/sleeping_bear_logo.svg" alt="Sleeping Bear Logo" />
          <nav>
            <a href="/home">Home</a>
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
        </body>
      </html>,
    );
  });

  return app;
}
