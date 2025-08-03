import { SeqTransport } from "@datalust/winston-seq";
import winston from "winston";
import { appConfig } from "./config";

// set up default transports
const transports: winston.transport[] = [new winston.transports.Console()];

// set up Seq logging
if (appConfig.SEQ_URL && appConfig.SEQ_API_KEY) {
  transports.push(
    new SeqTransport({
      serverUrl: appConfig.SEQ_URL,
      apiKey: appConfig.SEQ_API_KEY,
      onError: (e: Error) => {
        console.error(e);
      },
    }),
  );
}

// create logger
export const logger = winston.createLogger({
  defaultMeta: { application: "panda" },
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.simple(),
    winston.format.errors({ stack: true }),
  ),
  transports,
});
