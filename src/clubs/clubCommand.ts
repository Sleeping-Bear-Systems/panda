import { joinClub, JoinClub } from "./joinClub";
import { ClubEvent } from "./clubEvent";
import { ClubState } from "./clubState";
import { endClub, EndClub } from "./endClub";
import { startClub, StartClub } from "./startClub";
import { LeaveClub, leaveClub } from "./leaveClub";

/** Book command. */
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
