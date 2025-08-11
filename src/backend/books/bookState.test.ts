import { describe, expect, test } from "bun:test";

import { BookRecommended, RatingAdded, RatingRemoved } from "./bookEvent";
import { BookRating, BookState, evolve, initialState } from "./bookState";

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
      ratings: new Map<string, BookRating>(),
    });
  });

  test("RatingAdded applied to Recommended with no ratings adds the rating", () => {
    const initial: BookState = {
      status: "Recommended",
      isbn: "1234567890123",
      title: "title",
      year: 2025,
      ratings: new Map<string, BookRating>(),
    };
    const event: RatingAdded = {
      type: "RatingAdded",
      data: {
        isbn: "1234567890123",
        rating: 5,
        reason: "reason",
        accountId: "accountId",
      },
    };
    const state = evolve(initial, event);
    expect(state).toEqual({
      status: "Recommended",
      isbn: initial.isbn,
      title: initial.title,
      year: initial.year,
      ratings: new Map<string, BookRating>([
        ["accountId", { rating: 5, reason: "reason" }],
      ]),
    });
  });

  test("RatingAdded applied to Recommended with existing ratings updates the rating", () => {
    const initial: BookState = {
      status: "Recommended",
      isbn: "1234567890123",
      title: "title",
      year: 2025,
      ratings: new Map<string, BookRating>([
        ["accountId", { rating: 5, reason: "reason" }],
      ]),
    };
    const event: RatingAdded = {
      type: "RatingAdded",
      data: {
        isbn: "1234567890123",
        rating: 1,
        reason: "new reason",
        accountId: "accountId",
      },
    };
    const state = evolve(initial, event);
    expect(state).toEqual({
      status: "Recommended",
      isbn: initial.isbn,
      title: initial.title,
      year: initial.year,
      ratings: new Map<string, BookRating>([
        ["accountId", { rating: 1, reason: "new reason" }],
      ]),
    });
  });

  test("RatingRemoved applied to Recommended with existing ratings removes the rating", () => {
    const initial: BookState = {
      status: "Recommended",
      isbn: "1234567890123",
      title: "title",
      year: 2025,
      ratings: new Map<string, BookRating>([
        ["accountId", { rating: 5, reason: "reason" }],
      ]),
    };
    const event: RatingRemoved = {
      type: "RatingRemoved",
      data: {
        isbn: "1234567890123",
        reason: "new reason",
        accountId: "accountId",
      },
    };
    const state = evolve(initial, event);
    expect(state).toEqual({
      status: "Recommended",
      isbn: initial.isbn,
      title: initial.title,
      year: initial.year,
      ratings: new Map<string, BookRating>(),
    });
  });
});
