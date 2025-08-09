import { describe, expect, test } from "bun:test";

import { initialState, mapToStreamId } from "./accountState";

describe("initialState()", () => {
  test("return Unknown", () => {
    const state = initialState();
    expect(state).toEqual({ status: "Unknown" });
  });
});

describe("mapToStreamId()", () => {
  test("validates behavior", () => {
    const stream = mapToStreamId("1234");
    expect(stream).toEqual("account-1234");
  });
});
