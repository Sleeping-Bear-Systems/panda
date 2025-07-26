export type Role = "Administrator" | "General" | "Guest";

export type User = {
  id: string;
  username: string;
  password: string;
  role: Role;
};
