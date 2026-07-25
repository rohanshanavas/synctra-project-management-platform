export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  isEmailVerified: boolean;
  updatedAt: Date;
  profilePicture?: string;
}

export interface WorkSpace {
  id: string;
  name: string;
  description?: string;
  owner: User | string;
  color: string;
  members: {
    user: User;
    role: "admin" | "member" | "viewer" | "owner";
    joinedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}