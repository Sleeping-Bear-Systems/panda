import { ClubEvent } from "./clubEvent";

export type ClubState =
  | {
      status: "Unknown";
    }
  | {
      status: "Started";
      id: string;
      name: string;
      description: string;
      members: Map<string, MemberState>;
    }
  | {
      status: "Ended";
      id: string;
      name: string;
      description: string;
      members: Map<string, MemberState>;
    };

export type MemberState = {
  id: string;
  userId: string;
  role: string;
};

/** Initial state function. */
export function initialState(): ClubState {
  return { status: "Unknown" };
}

/** Evolve function. */
export function evolve(state: ClubState, event: ClubEvent): ClubState {
  if (state.status == "Unknown" && event.type == "ClubStarted") {
    return {
      status: "Started",
      id: event.data.id,
      name: event.data.name,
      description: event.data.description,
      members: new Map<string, MemberState>(),
    };
  } else if (state.status == "Started") {
    if (event.type == "ClubEnded" && event.data.id == state.id) {
      return {
        status: "Ended",
        id: state.id,
        name: state.name,
        description: state.description,
        members: new Map<string, MemberState>(state.members),
      };
    }
  }
  return state;
}
