import type { Command } from "@event-driven-io/emmett";

import type { ClubEvent } from "./clubEvent";
import type { ClubMetadata } from "./clubMetadata";
import type { ClubState } from "./clubState";

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
