import { DeciderSpecification } from "@event-driven-io/emmett";
import { describe, expect, test } from "bun:test";

import { addRating } from "./addRating";
import { AddRating, decide } from "./bookCommand";
import { BookRating, BookState, evolve, initialState } from "./bookState";

const given = DeciderSpecification.for({ decide, evolve, initialState });

// function execute(
//   state: BookState,
//   commands: BookCommand[],
//   evolve: (state: BookState, event: BookEvent) => BookState,
//   decide: (command: BookCommand, state: BookState) => BookEvent[],
// ): BookState {
//   let currentState = state;
//   for (const command of commands) {
//     const events = decide(command, currentState);
//     for (const event of events) {
//       currentState = evolve(currentState, event);
//     }
//   }
//   return currentState;
// }

describe("addRating()", () => {
  test("Unknown returns no events", () => {
    given([])
      .when({
        type: "AddRating",
        data: {
          isbn: "1234567890123",
          rating: 5,
          reason: "reason",
          accountId: "accountId",
        },
      })
      .then([]);
  });

  test("Unknown returns no events", () => {
    const state = initialState();
    const command: AddRating = {
      type: "AddRating",
      data: {
        isbn: "1234567890123",
        rating: 5,
        reason: "reason",
        accountId: "accountId",
      },
    };
    const events = addRating(command, state);
    expect(events.length).toEqual(0);
  });

  test("different ISBN returns no events", () => {
    const state: BookState = {
      status: "Recommended",
      isbn: "1234567890123",
      title: "title",
      year: 2025,
      ratings: new Map<string, BookRating>(),
    };
    const command: AddRating = {
      type: "AddRating",
      data: {
        isbn: "2345678901234",
        rating: 5,
        reason: "reason",
        accountId: "accountId",
      },
    };
    const events = addRating(command, state);
    expect(events).toBeEmpty();
  });

  test("Recommended and same ISBN returns RatingAdded", () => {
    const state: BookState = {
      status: "Recommended",
      isbn: "1234567890123",
      title: "title",
      year: 2025,
      ratings: new Map<string, BookRating>(),
    };
    const command: AddRating = {
      type: "AddRating",
      data: {
        isbn: "1234567890123",
        rating: 5,
        reason: "reason",
        accountId: "accountId",
      },
    };
    const events = addRating(command, state);
    expect(events.length).toEqual(1);
    expect(events[0]).toEqual({
      type: "RatingAdded",
      data: {
        isbn: command.data.isbn,
        rating: command.data.rating,
        reason: command.data.reason,
        accountId: command.data.accountId,
      },
    });
  });
});
