import { ClubEvent } from "./clubEvent";
import { ClubState } from "./clubState";
import { endClub, EndClub } from "./endClub";
import { startClub, StartClub } from "./startClub";

/** Book command. */
export type ClubCommand = StartClub | EndClub;

/** Decide function. */
export function decide(command: ClubCommand, state: ClubState): ClubEvent[] {
  switch (command.type) {
    case "StartClub":
      return startClub(command, state);
    case "EndClub":
      return endClub(command, state);
  }
}
