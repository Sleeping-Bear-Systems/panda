import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { mapAddRatingEndpoint } from "./backend/books/addRating";
import { mapLoginEndpoint } from "./backend/users/login";
import { DateProvider, DefaultDateProvider } from "./dateProvider";
import { mapLogoutEndpoint } from "./backend/users/logout";
import { logger } from "./logger";
import { jwt } from "hono/jwt";
import { aboutPage } from "./frontend/pages/aboutPage";
import { loginPage } from "./frontend/pages/loginPage";
import { appConfig } from "./config";
import { startClubPage } from "./frontend/pages/startClubPage";
import { homePage } from "./frontend/pages/homePage";

// set date provider
const dateProvider: DateProvider = DefaultDateProvider;

// start database
const connectionString = process.env.POSTGRES_CONNECTION_STRING;
if (!connectionString) {
  logger.error("Invalid connection string.");
  process.exit(1);
}

logger.info("🚀 Starting application");

const app = new Hono();

app.use(
  "/api/private",
  jwt({ secret: appConfig.JWT_SECRET, cookie: appConfig.jwtCookieName }),
);

app.get("/api/public/ping", (c) => {
  return c.json({}, 200);
});
app.route("/api/private/books", mapAddRatingEndpoint());
app.route("/api/public", mapLoginEndpoint(dateProvider));
app.route("/api/public", mapLogoutEndpoint());

app.route("/", loginPage);
app.route("/", aboutPage);
app.route("/", startClubPage);
app.route("/", homePage);

app.get("/api/private/test", (c) => {
  const payload = c.get("jwtPayload");
  if (payload.id) logger.info(JSON.stringify(payload));
  return c.text("success", 200);
});

app.use("/*", serveStatic({ root: "./public" }));

export default {
  port: appConfig.PORT,
  fetch: app.fetch,
};
