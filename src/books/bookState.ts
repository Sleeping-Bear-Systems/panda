/** Book state. */
export type BookState =
  | { status: "Unknown" }
  | { status: "Recommended"; isbn: string; title: string; year: number };

/** Initial state function. */
export function initialState(): BookState {
  return { status: "Unknown" };
}
