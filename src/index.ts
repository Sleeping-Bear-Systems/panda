import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { mapAddRatingEndpoint } from "./books/addRating";
import { mapLoginEndpoint } from "./users/login";
import { DateProvider, DefaultDateProvider } from "./dateProvider";
import { mapLogoutEndpoint } from "./users/logout";
import { createLogger } from "./logger";

// set date provider
const dateProvider: DateProvider = DefaultDateProvider;

const environment = process.env.NODE_ENV ?? "development";

// start logger
const logger = createLogger(environment);

// start database
const connectionString = process.env.POSTGRES_CONNECTION_STRING;
if (!connectionString) {
  logger.error("Invalid connection string.");
  process.exit(1);
}

logger.info("🚀 Starting application");

const app = new Hono();

app.get("/api/ping", (c) => {
  return c.json({}, 200);
});
app.route("/api/books", mapAddRatingEndpoint());
app.route("/api/users", mapLoginEndpoint(dateProvider));
app.route("/api/users", mapLogoutEndpoint());
app.use("/*", serveStatic({ root: "./public" }));

const port = process.env.PORT ?? 3000;
export default {
  port,
  fetch: app.fetch,
};
