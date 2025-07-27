import { z } from "zod/v4";

const configSchema = z.object({
  connectionString: z.string().nonempty(),
  environment: z
    .literal(["development", "production", "staging", "test"])
    .default("development"),
  jwtCookieName: z.string().nonempty().default("panda"),
  jwtSecret: z.string().min(32),
  port: z.coerce.number().int().gte(1024).default(3000),
});

export type Config = Readonly<z.infer<typeof configSchema>>;

/** Validates the supplied configuration */
export function validateConfig(
  record: Record<string, string | number | boolean | undefined | null>,
): Config {
  return configSchema.parse(record);
}
