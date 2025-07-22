import type { Event } from "@event-driven-io/emmett";

/** Book recommended event. */
export type BookRecommended = Event<
  "BookRecommended",
  { isbn: string; title: string; year: number }
>;

/** Book rated event. */
export type BookRated = Event<
  "BookRated",
  { isbn: string; rating: number; reason: string; userId: string }
>;

/** Book event. */
export type BookEvent = BookRecommended | BookRated;
