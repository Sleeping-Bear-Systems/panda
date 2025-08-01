import { Command } from "@event-driven-io/emmett/.";
import { ClubState } from "./clubState";
import { ClubEvent } from "./clubEvent";
import { ClubMetadata } from "./clubMetadata";

export type EndClub = Command<"EndClub", { id: string }, ClubMetadata>;

export function endClub(command: EndClub, state: ClubState): ClubEvent[] {
  if (state.status != "Started" || state.id != command.data.id) {
    return [];
  }
  return [
    {
      type: "ClubEnded",
      data: {
        id: command.data.id,
      },
      metadata: command.metadata,
    },
  ];
}
