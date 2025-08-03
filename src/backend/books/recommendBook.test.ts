import { describe, expect, test } from "bun:test";

import { RecommendBook } from "./bookCommand";
import { BookRating, BookState, initialState } from "./bookState";
import { recommendBook } from "./recommendBook";

describe("recommendBook()", () => {
  test("Unknown returns BookRecommend event", () => {
    const state: BookState = initialState();
    const command: RecommendBook = {
      type: "RecommendBook",
      data: {
        isbn: "123456790123",
        title: "title",
        year: 2025,
      },
    };
    const events = recommendBook(command, state);
    expect(events.length).toEqual(1);
    expect(events[0]).toEqual({
      type: "BookRecommended",
      data: {
        isbn: command.data.isbn,
        title: command.data.title,
        year: command.data.year,
      },
    });
  });

  test("Recommended returns no events", () => {
    const state: BookState = {
      status: "Recommended",
      isbn: "1234567890123",
      title: "title",
      year: 2025,
      ratings: new Map<string, BookRating>(),
    };
    const command: RecommendBook = {
      type: "RecommendBook",
      data: {
        isbn: "123456790123",
        title: "title",
        year: 2025,
      },
    };
    const events = recommendBook(command, state);
    expect(events).toBeEmpty();
  });
});
