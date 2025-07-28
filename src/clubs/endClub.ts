import { Command } from "@event-driven-io/emmett/.";
import { ClubState } from "./clubState";
import { ClubEvent } from "./clubEvent";

export type EndClub = Command<
  "EndClub",
  { id: string },
  { userId: string; timestamp: Date }
>;

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
      metadata: {
        userId: command.metadata.userId,
        timestamp: command.metadata.timestamp,
      },
    },
  ];
}
