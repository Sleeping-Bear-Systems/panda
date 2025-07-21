import { describe, expect, test } from "bun:test";
import { BookState, initialState } from "./bookState";
import { recommendBook, RecommendBook } from "./recommendBook";
import { BookRecommended } from "./bookEvent";

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
    const event = events[0] as BookRecommended;
    expect(event.type).toEqual("BookRecommended");
    expect(event.data.isbn).toEqual(command.data.isbn);
    expect(event.data.title).toEqual(command.data.title);
    expect(event.data.year).toEqual(command.data.year);
  });

  test("Recommended returns no events", () => {
    const state: BookState = {
      status: "Recommended",
      isbn: "1234567890123",
      title: "title",
      year: 2025,
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
    expect(events.length).toEqual(0);
  });
});
