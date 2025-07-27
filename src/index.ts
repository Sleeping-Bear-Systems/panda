import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import winston from "winston";
import { SeqTransport } from "@datalust/winston-seq";
import { mapAddRatingEndpoint } from "./books/addRating";
import { mapLoginEndpoint } from "./users/login";
import { DateProvider, DefaultDateProvider } from "./dateProvider";
import { mapLogoutEndpoint } from "./users/logout";

// set date provider
const dateProvider: DateProvider = DefaultDateProvider;

// start logger
const environment = process.env.NODE_ENV ?? "development";
const seqApiKey = process.env.SEQ_API_KEY;
const seqUrl = process.env.SEQ_URL;

const logger = winston.createLogger({
  defaultMeta: { application: "panda", environment: environment },
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.simple(),
  ),
  transports: [
    new SeqTransport({
      serverUrl: seqUrl,
      apiKey: seqApiKey,
      onError: (e: Error) => {
        console.error(e);
      },
    }),
    new winston.transports.Console(),
  ],
});

// start database
const connectionString = process.env.POSTGRES_CONNECTION_STRING;
if (!connectionString) {
  logger.error("Invalid connection string.");
  process.exit(1);
}

logger.info("🚀 Starting application");
const port = process.env.PORT ?? 3000;

const app = new Hono();

app.get("/api/ping", (c) => {
  return c.json({}, 200);
});
app.route("/api/books", mapAddRatingEndpoint());
app.route("/api/users", mapLoginEndpoint(dateProvider));
app.route("/api/users", mapLogoutEndpoint());
app.use("/*", serveStatic({ root: "./public" }));

export default {
  port,
  fetch: app.fetch,
};
