export type Role = "Administrator" | "General" | "Guest";

export interface User {
  id: string;
  username: string;
  password: string;
  role: Role;
}
