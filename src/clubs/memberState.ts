/** Member role. */
export type MemberRole = "Owner" | "General";

/** Member status. */
export type MemberStatus = "Active" | "Inactive" | "Pending";

/** Member state. */
export type MemberState = {
  role: MemberRole;
  status: MemberStatus;
};
