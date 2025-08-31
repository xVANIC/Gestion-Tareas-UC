"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TaskCard } from "./TaskCard";
import { TaskDialog } from "./TaskDialog";
import type { Task, TaskCategory } from "@/types";
import { useState } from "react";

interface TaskListProps {
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onUpdateCategory: (id: string, category: TaskCategory) => void;
  onUpdateTask: (id: string, task: Partial<Task>) => void;
}

export const TaskList = ({
  tasks,
  onDeleteTask,
  onUpdateCategory,
  onUpdateTask,
}: TaskListProps) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleSaveTask = (updatedTask: Partial<Task>) => {
    if (editingTask) {
      onUpdateTask(editingTask.id, updatedTask);
      setEditingTask(null);
    }
  };
  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
        role="status"
        aria-live="polite"
      >
        <div
          className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full 
                        flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-gray-400 dark:text-gray-500"
            aria-hidden="true"
          >
            📝
          </motion.div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          No hay tareas
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          ¡Comienza agregando tu primera tarea!
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        role="list"
        aria-label="Lista de tareas"
      >
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onDeleteTask}
              onEdit={handleEditTask}
              onUpdateCategory={onUpdateCategory}
            />
          ))}
        </AnimatePresence>
      </div>

      <TaskDialog
        isOpen={!!editingTask}
        task={editingTask || undefined}
        onClose={() => setEditingTask(null)}
        onSave={handleSaveTask}
      />
    </>
  );
};
