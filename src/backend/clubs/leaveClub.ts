import { Command } from "@event-driven-io/emmett";

import { ClubEvent } from "./clubEvent";
import { ClubMetadata } from "./clubMetadata";
import { ClubState } from "./clubState";

/** Leave club command. */
export type LeaveClub = Command<"LeaveClub", { id: string }, ClubMetadata>;

/** Leave club function. */
export function leaveClub(command: LeaveClub, state: ClubState): ClubEvent[] {
  if (
    state.status == "Unknown" ||
    state.id != command.data.id ||
    !state.members.has(command.metadata.accountId)
  ) {
    return [];
  }
  return [
    {
      type: "ClubLeft",
      data: {
        id: command.data.id,
      },
      metadata: command.metadata,
    },
  ];
}
