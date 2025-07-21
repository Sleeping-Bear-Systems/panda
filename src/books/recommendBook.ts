import type { Command } from "@event-driven-io/emmett";
import { BookState } from "./bookState";
import { BookEvent } from "./bookEvent";

/** Recommend book command. */
export type RecommendBook = Command<
  "RecommendBook",
  { isbn: string; title: string; year: number }
>;

/** Recommends a book. */
export function recommendBook(
  command: RecommendBook,
  state: BookState,
): BookEvent[] {
  if (state.status != "Unknown") {
    return [];
  }
  return [
    {
      type: "BookRecommended",
      data: {
        isbn: command.data.isbn,
        title: command.data.title,
        year: command.data.year,
      },
    },
  ];
}
