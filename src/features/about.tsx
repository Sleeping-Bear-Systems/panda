import { Hono } from "hono";

import { Head } from "../shared/head.js";
import { ROUTES } from "../shared/routes.js";

export const aboutPage = new Hono().get("/", (c) => {
  return c.html(
    <html>
      <Head />
      <body>
        <img src="/images/sleeping_bear_logo.svg" alt="Sleeping Bear Logo" />
        <nav>
          <a href={ROUTES.HOME}>Home</a>
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
        <div>
          Copyright &copy; {new Date().getFullYear()} Sleeping Bear Systems
        </div>
      </body>
    </html>,
  );
});
