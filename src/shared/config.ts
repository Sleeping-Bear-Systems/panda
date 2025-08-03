import { z } from "zod/v4";

const environmentConfigSchema = z.object({
  NODE_ENV: z
    .literal(["development", "production", "staging", "test"])
    .default("development"),
  SEQ_API_KEY: z.string().optional(),
  SEQ_URL: z.url().optional(),
  JWT_SECRET: z.string().min(16),
  BCRYPT_KEY: z.string().min(16),
  POSTGRES_CONNECTION_STRING: z.string(),
  PORT: z.coerce.number().min(1024).max(49151),
});

export type ApplicationConfig = Readonly<
  z.infer<typeof environmentConfigSchema>
> & {
  jwtCookieName: string;
};

export const appConfig: ApplicationConfig = {
  ...environmentConfigSchema.parse(process.env),
  jwtCookieName: "panda",
};
