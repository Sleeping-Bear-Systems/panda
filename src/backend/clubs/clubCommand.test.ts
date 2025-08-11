import { DeciderSpecification } from "@event-driven-io/emmett";
import { describe, test } from "bun:test";

import { decide } from "./clubCommand";
import { evolve, initialState } from "./clubState";

const given = DeciderSpecification.for({ decide, evolve, initialState });
const metadata = {
  accountId: "accountId",
  timestamp: new Date(2025, 6, 27),
  correlationId: "123",
};

describe("StartClub", () => {
  test("applied to Unknown generates ClubStarted and ClubJoined event", () => {
    given([])
      .when({
        type: "StartClub",
        data: {
          id: "12345",
          name: "name",
          description: "description",
          isPublic: true,
        },
        metadata,
      })
      .then([
        {
          type: "ClubStarted",
          data: {
            id: "12345",
            name: "name",
            description: "description",
            isPublic: true,
          },
          metadata,
        },
        {
          type: "ClubJoined",
          data: {
            id: "12345",
            role: "Owner",
            status: "Active",
          },
          metadata,
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
          isPublic: true,
        },
        metadata,
      },
    ])
      .when({
        type: "StartClub",
        data: {
          id: "12345",
          name: "name",
          description: "description",
          isPublic: true,
        },
        metadata,
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
      metadata,
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
          isPublic: true,
        },
        metadata,
      },
    ])
      .when({
        type: "EndClub",
        data: { id: "12345" },
        metadata,
      })
      .then([]);
  });
});
