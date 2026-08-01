export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: Date;
  isEmailVerified: boolean;
  updatedAt: Date;
  profilePicture?: string;
}

export interface WorkSpace {
  _id: string;
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

export enum ProjectStatus {
  PLANNING = "Planning",
  IN_PROGRESS = "In Progress",
  ON_HOLD = "On Hold",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}

export interface Project {
  _id: string;
  title: string;
  description?: string;
  status: ProjectStatus;
  workspace: WorkSpace;
  startDate: Date;
  dueDate: Date;
  progress: number;
  tasks: Task[];
  members: {
    user: User;
    role: "admin" | "member" | "viewer" | "owner";
  }[];
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
}

export type TaskStatus = "To Do" | "In Progress" | "Review" | "Done";
export type TaskPriority = "Low" | "Medium" | "High";

export interface Subtask {
  _id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface Attachment {
  _id: string;
  filename: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  project: Project;
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
  dueDate: Date;
  priority: TaskPriority;
  assignee: User | string;
  createdBy: User | string;
  assignees: User[];
  subtasks?: Subtask[];
  watchers?: User[];
  attachments?: Attachment[];
}

