import { BookEvent } from "./bookEvent";

/** Book rating. */
export interface BookRating {
  rating: number;
  reason: string;
  userId: string;
}
/** Book state. */
export type BookState =
  | { status: "Unknown" }
  | {
      status: "Recommended";
      isbn: string;
      title: string;
      year: number;
      ratings: BookRating[];
    };

/** Initial state function. */
export function initialState(): BookState {
  return { status: "Unknown" };
}

/** Evolve function. */
export function evolve(state: BookState, event: BookEvent): BookState {
  if (state.status == "Unknown") {
    if (event.type == "BookRecommended") {
      return {
        status: "Recommended",
        isbn: event.data.isbn,
        title: event.data.title,
        year: event.data.year,
        ratings: [],
      };
    }
  } else if (state.status == "Recommended") {
    if (event.type == "BookRated" && state.isbn == event.data.isbn) {
      state.ratings = state.ratings
        .filter((r) => r.userId != event.data.userId)
        .concat({
          rating: event.data.rating,
          reason: event.data.reason,
          userId: event.data.userId,
        });
    }
  }
  return state;
}
