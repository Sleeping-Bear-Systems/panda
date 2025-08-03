import { describe, expect, test } from "bun:test";

import { initialState, mapToStreamId } from "./clubState";

describe("initialState()", () => {
  test("returns Unknown", () => {
    const state = initialState();
    expect(state).toEqual({ status: "Unknown" });
  });
});

describe("mapToStreamId()", () => {
  test("verifies behavior", () => {
    const streamId = mapToStreamId("1234");
    expect(streamId).toEqual("club-1234");
  });
});
