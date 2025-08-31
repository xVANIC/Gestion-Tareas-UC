import type { Task, TaskCategory, FilterType } from "@/types";

export const filterTasks = (tasks: Task[], filter: FilterType): Task[] => {
  if (filter === "todas") return tasks;
  return tasks.filter((task) => task.category === filter);
};

export const getCategoryLabel = (category: TaskCategory): string => {
  const labels = {
    "por-hacer": "Por Hacer",
    "en-progreso": "En Progreso",
    hecho: "Hecho",
  };
  return labels[category];
};

export const getCategoryColor = (category: TaskCategory): string => {
  const colors = {
    "por-hacer":
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    "en-progreso":
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    hecho: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  };
  return colors[category];
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

export const isTaskOverdue = (task: Task): boolean => {
  if (!task.dueDate || task.category === "hecho") return false;
  return new Date() > task.dueDate;
};
