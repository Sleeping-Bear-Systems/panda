import { BookState } from "./bookState";
import { BookEvent } from "./bookEvent";
import { RecommendBook } from "./bookCommand";

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
