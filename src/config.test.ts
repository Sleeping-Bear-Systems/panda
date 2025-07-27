import { describe, test, expect } from "bun:test";
import { validateConfig } from "./config";

describe("validateConfig()", () => {
  const testJwtSecret = "012345678901234567890123456789012";
  const testConnectionString =
    "postgres://username:password@localhost:5432/postgres";

  test("test all values map correctly", () => {
    const config = validateConfig({
      connectionString: testConnectionString,
      environment: "development",
      jwtCookieName: "cookie",
      jwtSecret: testJwtSecret,
      port: "12345",
    });
    expect(config.connectionString).toEqual(testConnectionString);
    expect(config.environment).toEqual("development");
    expect(config.jwtCookieName).toEqual("cookie");
    expect(config.jwtSecret).toEqual(testJwtSecret);
    expect(config.port).toEqual(12345);
  });

  test("test default values are set correctly", () => {
    const config = validateConfig({
      jwtSecret: testJwtSecret,
      connectionString: testConnectionString,
    });
    expect(config.connectionString).toEqual(testConnectionString);
    expect(config.environment).toEqual("development");
    expect(config.jwtCookieName).toEqual("panda");
    expect(config.jwtSecret).toEqual(testJwtSecret);
    expect(config.port).toEqual(3000);
  });
});
