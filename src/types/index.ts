
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  tasks: Task[];
  pinned: boolean;
  theme?: string; // New theme property
}

export type ThemeColor = 
  | "default" 
  | "blue" 
  | "green" 
  | "purple" 
  | "orange" 
  | "pink" 
  | "teal" 
  | "yellow" 
  | "red";
