// Definimos la estructura de una tarea.
export interface Task {
  id: string; // Identificador único de la tarea.
  title: string; // Título de la tarea.
  description?: string; // Descripción opcional de la tarea.
  category: TaskCategory; // Categoría de la tarea (por hacer, en progreso, hecho).
  createdAt: Date; // Fecha de creación de la tarea.
  updatedAt: Date; // Última fecha de actualización de la tarea.
  dueDate?: Date; // Fecha de vencimiento opcional de la tarea.
}

// Definimos los tipos de categorías posibles para las tareas.
export type TaskCategory = "por-hacer" | "en-progreso" | "hecho";

// Definimos la estructura de los datos del formulario para crear o editar una tarea.
export interface TaskFormData {
  title: string; // Título de la tarea.
  description?: string; // Descripción opcional.
  category: TaskCategory; // Categoría de la tarea.
  dueDate?: Date; // Fecha de vencimiento opcional.
}

// Definimos la estructura para las estadísticas de las tareas.
export interface TaskStats {
  total: number; // Número total de tareas.
  porHacer: number; // Número de tareas en la categoría "por-hacer".
  enProgreso: number; // Número de tareas en la categoría "en-progreso".
  hecho: number; // Número de tareas en la categoría "hecho".
  completionRate: number; // Porcentaje de finalización de las tareas.
}

// Definimos los tipos de filtro que se pueden aplicar a la lista de tareas.
export type FilterType = "todas" | TaskCategory | "por-fecha";
