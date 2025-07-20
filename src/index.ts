import { Hono } from "hono";

const port = process.env.PORT ?? 3000;

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default {
  port,
  fetch: app.fetch,
};
