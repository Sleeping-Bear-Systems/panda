import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { mapAddRatingEndpoint } from "./books/addRating";
import { mapLoginEndpoint } from "./users/login";
import { DateProvider, DefaultDateProvider } from "./dateProvider";
import { mapLogoutEndpoint } from "./users/logout";
import { createLogger } from "./logger";
import { jwt } from "hono/jwt";
import { mapAboutPage } from "./pages/aboutPage";
import { mapLoginPage } from "./pages/loginPage";
import { mapCreateClub as mapCreateClubPage } from "./pages/createClubPage";
import { appConfig } from "./config";
import { mapHomePage } from "./pages/homePage";

// set date provider
const dateProvider: DateProvider = DefaultDateProvider;

// start logger
const logger = createLogger();

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
app.route("/", mapAboutPage());
app.route("/", mapLoginPage());
app.route("/", mapCreateClubPage());
app.route("/", mapHomePage());

app.get(
  "/api/test",
  jwt({ secret: appConfig.JWT_SECRET, cookie: appConfig.jwtCookieName }),
  (c) => {
    return c.text("success", 200);
  },
);

app.use("/*", serveStatic({ root: "./public" }));

export default {
  port: appConfig.PORT,
  fetch: app.fetch,
};
