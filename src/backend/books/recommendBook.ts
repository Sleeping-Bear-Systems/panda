import { RecommendBook } from "./bookCommand";
import { BookEvent } from "./bookEvent";
import { BookState } from "./bookState";

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
