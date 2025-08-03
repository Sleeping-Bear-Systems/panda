import { ClubEvent } from "./clubEvent";
import { ClubState } from "./clubState";
import { EndClub, endClub } from "./endClub";
import { JoinClub, joinClub } from "./joinClub";
import { LeaveClub, leaveClub } from "./leaveClub";
import { StartClub, startClub } from "./startClub";

/** Club command. */
export type ClubCommand = StartClub | EndClub | JoinClub | LeaveClub;

/** Decide function. */
export function decide(command: ClubCommand, state: ClubState): ClubEvent[] {
  switch (command.type) {
    case "StartClub":
      return startClub(command, state);
    case "EndClub":
      return endClub(command, state);
    case "JoinClub":
      return joinClub(command, state);
    case "LeaveClub":
      return leaveClub(command, state);
  }
}
