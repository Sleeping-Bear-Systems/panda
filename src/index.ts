import { Hono } from "hono";
import { serveStatic } from "hono/bun";

const port = process.env.PORT ?? 3000;

const app = new Hono();

app.use("/*", serveStatic({ root: "./public" }));

export default {
  port,
  fetch: app.fetch,
};
