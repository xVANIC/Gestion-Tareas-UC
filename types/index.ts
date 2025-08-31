export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}

export type TaskCategory = "por-hacer" | "en-progreso" | "hecho";

export interface TaskFormData {
  title: string;
  description?: string;
  category: TaskCategory;
  dueDate?: Date;
}

export interface TaskStats {
  total: number;
  porHacer: number;
  enProgreso: number;
  hecho: number;
  completionRate: number;
}

export type FilterType = "todas" | TaskCategory;
