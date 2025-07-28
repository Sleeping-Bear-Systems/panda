import { DeciderSpecification } from "@event-driven-io/emmett";
import { evolve, initialState } from "./clubState";
import { decide } from "./clubCommand";
import { describe, test } from "bun:test";

const given = DeciderSpecification.for({ decide, evolve, initialState });
const userId = "userId";
const timestamp = new Date(2025, 6, 27);

describe("StartClub", () => {
  test("applied to Unknown generates ClubStarted event", () => {
    given([])
      .when({
        type: "StartClub",
        data: {
          id: "12345",
          name: "name",
          description: "description",
        },
        metadata: {
          userId,
          timestamp,
        },
      })
      .then([
        {
          type: "ClubStarted",
          data: {
            id: "12345",
            name: "name",
            description: "description",
          },
          metadata: {
            userId,
            timestamp,
          },
        },
      ]);
  });

  test("applied to Started generates no events", () => {
    given([
      {
        type: "ClubStarted",
        data: {
          id: "12345",
          name: "name",
          description: "description",
        },
        metadata: {
          userId,
          timestamp,
        },
      },
    ])
      .when({
        type: "StartClub",
        data: {
          id: "12345",
          name: "name",
          description: "description",
        },
        metadata: {
          userId,
          timestamp,
        },
      })
      .then([]);
  });
});

describe("EndClub", () => {
  test("applied to Unknown returns no events", () => {
    given([]).when({
      type: "EndClub",
      data: {
        id: "12345",
      },
      metadata: {
        userId,
        timestamp,
      },
    });
  });

  test("applied to Started with different ID returns no events", () => {
    given([
      {
        type: "ClubStarted",
        data: {
          id: "24680",
          name: "name",
          description: "description",
        },
        metadata: {
          userId,
          timestamp,
        },
      },
    ])
      .when({
        type: "EndClub",
        data: { id: "12345" },
        metadata: { userId, timestamp },
      })
      .then([]);
  });
});
