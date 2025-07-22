import { describe, expect, test } from "bun:test";
import { BookState, initialState } from "./bookState";
import { rateBook, RateBook } from "./rateBook";

describe("rateBook()", () => {
  test("Unknown returns no events", () => {
    const state = initialState();
    const command: RateBook = {
      type: "RateBook",
      data: {
        isbn: "1234567890123",
        rating: 5,
        reason: "reason",
        userId: "userId",
      },
    };
    const events = rateBook(command, state);
    expect(events.length).toEqual(0);
  });

  test("different ISBN returns no events", () => {
    const state: BookState = {
      status: "Recommended",
      isbn: "1234567890123",
      title: "title",
      year: 2025,
      ratings: [],
    };
    const command: RateBook = {
      type: "RateBook",
      data: {
        isbn: "2345678901234",
        rating: 5,
        reason: "reason",
        userId: "userId",
      },
    };
    const events = rateBook(command, state);
    expect(events).toBeEmpty();
  });

  test("Recommended and same ISBN returns BookRated", () => {
    const state: BookState = {
      status: "Recommended",
      isbn: "1234567890123",
      title: "title",
      year: 2025,
      ratings: [],
    };
    const command: RateBook = {
      type: "RateBook",
      data: {
        isbn: "1234567890123",
        rating: 5,
        reason: "reason",
        userId: "userId",
      },
    };
    const events = rateBook(command, state);
    expect(events.length).toEqual(1);
    expect(events[0]).toEqual({
      type: "BookRated",
      data: {
        isbn: command.data.isbn,
        rating: command.data.rating,
        reason: command.data.reason,
        userId: command.data.userId,
      },
    });
  });
});
