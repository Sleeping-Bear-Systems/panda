import { describe, expect, test } from "bun:test";
import { ClubState, initialState, isOwner, MemberState } from "./clubState";

describe("initialState()", () => {
  test("returns Unknown", () => {
    const state = initialState();
    expect(state).toEqual({ status: "Unknown" });
  });
});

describe("isOwner()", () => {
  const userId = "12345";

  test("Unknown returns false", () => {
    const state: ClubState = {
      status: "Unknown",
    };
    expect(isOwner(state, userId)).toBeFalse();
  });

  test("Member not found returns false", () => {
    const state: ClubState = {
      status: "Started",
      id: "12345",
      name: "name",
      description: "description",
      isPublic: true,
      members: new Map<string, MemberState>(),
    };
    expect(isOwner(state, userId)).toBeFalse();
  });

  test("General Member returns false", () => {
    const state: ClubState = {
      status: "Started",
      id: "12345",
      name: "name",
      description: "description",
      isPublic: true,
      members: new Map<string, MemberState>([
        [userId, { role: "General", isActive: true }],
      ]),
    };
    expect(isOwner(state, userId)).toBeFalse();
  });

  test("Owner Member returns true", () => {
    const state: ClubState = {
      status: "Started",
      id: "12345",
      name: "name",
      description: "description",
      isPublic: true,
      members: new Map<string, MemberState>([
        [userId, { role: "Owner", isActive: true }],
      ]),
    };
    expect(isOwner(state, userId)).toBeTrue();
  });
});
