import { describe, test, expect } from "bun:test";
import { initialState } from "./bookState";

describe("initialState()", () => {
  test("return Unknown", () => {
    const state = initialState();
    expect(state.status).toBe("Unknown");
  });
});
