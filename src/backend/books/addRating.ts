import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod/v4";

import { AddRating } from "./bookCommand";
import { BookEvent } from "./bookEvent";
import { BookState } from "./bookState";

/** Add rating function. */
export function addRating(command: AddRating, state: BookState): BookEvent[] {
  if (state.status != "Recommended" || state.isbn != command.data.isbn) {
    return [];
  }
  return [
    {
      type: "RatingAdded",
      data: {
        isbn: command.data.isbn,
        rating: command.data.rating,
        reason: command.data.reason,
        accountId: command.data.accountId,
      },
    },
  ];
}

const addRatingRequestSchema = z.object({
  isbn: z.string(),
  rating: z.number().min(0).max(5),
  reason: z.string().optional(),
  accountId: z.string().nonempty(),
});

type AddRatingRequest = z.infer<typeof addRatingRequestSchema>;

export const addRatingApi = new Hono().post(
  "/",
  zValidator("json", addRatingRequestSchema),
  (c) => {
    const request: AddRatingRequest = c.req.valid("json");
    const command: AddRating = {
      type: "AddRating",
      data: {
        isbn: request.isbn,
        rating: request.rating,
        reason: request.reason ?? "",
        accountId: request.accountId,
      },
    };
    console.log(command);
    return c.json({}, 400);
  },
);
