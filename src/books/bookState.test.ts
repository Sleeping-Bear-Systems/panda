import { describe, test, expect } from "bun:test";
import { BookState, evolve, initialState } from "./bookState";
import { BookRated, BookRecommended } from "./bookEvent";

describe("initialState()", () => {
  test("return Unknown", () => {
    const state = initialState();
    expect(state.status).toBe("Unknown");
  });
});

describe("evolve()", () => {
  test("BookRecommended applied to Unknown returns Recommended", () => {
    const initial: BookState = initialState();
    const event: BookRecommended = {
      type: "BookRecommended",
      data: {
        isbn: "1234567890123",
        title: "title",
        year: 2025,
      },
    };
    const state = evolve(initial, event);
    expect(state).toEqual({
      status: "Recommended",
      isbn: event.data.isbn,
      title: event.data.title,
      year: event.data.year,
      ratings: [],
    });
  });

  test("BookRated applied to Recommended with no ratings adds the rating", () => {
    const initial: BookState = {
      status: "Recommended",
      isbn: "1234567890123",
      title: "title",
      year: 2025,
      ratings: [],
    };
    const event: BookRated = {
      type: "BookRated",
      data: {
        isbn: "1234567890123",
        rating: 5,
        reason: "reason",
        userId: "userId",
      },
    };
    const state = evolve(initial, event);
    expect(state).toBe({
      status: "Recommended",
      isbn: initial.isbn,
      title: initial.title,
      year: initial.year,
      ratings: [
        {
          rating: 5,
          reason: "reason",
          userId: "userId",
        },
      ],
    });
  });
});
