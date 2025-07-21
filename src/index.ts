import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import winston from "winston";
import { SeqTransport } from "@datalust/winston-seq";

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

logger.info("🚀 Starting application");
const port = process.env.PORT ?? 3000;

const app = new Hono();

app.use("/*", serveStatic({ root: "./public" }));

export default {
  port,
  fetch: app.fetch,
};
