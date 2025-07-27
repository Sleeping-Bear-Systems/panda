import { SeqTransport } from "@datalust/winston-seq";
import winston from "winston";
import { z } from "zod/v4";

/** Create logger function. */
export function createLogger(environment: string): winston.Logger {
  const seqConfigurationSchema = z.object({
    apiKey: z.string().nonempty(),
    url: z.url(),
  });

  // set up default transports
  const transports: winston.transport[] = [new winston.transports.Console()];

  // configure Seq transport
  const result = seqConfigurationSchema.safeParse({
    apiKey: process.env.SEQ_API_KEY,
    url: process.env.SEQ_URL,
  });
  if (result.success) {
    transports.push(
      new SeqTransport({
        serverUrl: result.data.url,
        apiKey: result.data.apiKey,
        onError: (e: Error) => {
          console.error(e);
        },
      }),
    );
  }

  // start logger
  const logger = winston.createLogger({
    defaultMeta: { application: "panda", environment: environment },
    format: winston.format.combine(
      winston.format.splat(),
      winston.format.simple(),
    ),
    transports,
  });
  return logger;
}
