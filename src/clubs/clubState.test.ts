import { describe, expect, test } from "bun:test";
import { initialState } from "./clubState";

describe("initialState()", () => {
  test("returns Unknown", () => {
    const state = initialState();
    expect(state).toEqual({ status: "Unknown" });
  });
});
