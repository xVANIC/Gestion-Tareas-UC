"use client";

import { motion, AnimatePresence } from "framer-motion";
import { StickyNoteCard } from "./StickyNoteCard";
import { ListCard } from "./ListCard";
import { TaskDialog } from "./TaskDialog";
import type { Task, TaskCategory } from "@/types";
import { useState } from "react";

interface TaskListProps {
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onUpdateCategory: (id: string, category: TaskCategory) => void;
  onUpdateTask: (id: string, task: Partial<Task>) => void;
  viewMode: "grid" | "list";
}

export const TaskList = ({
  tasks,
  onDeleteTask,
  onUpdateCategory,
  onUpdateTask,
  viewMode,
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
          className="w-24 h-24 mx-auto mb-4 bg-gray-50 dark:bg-gray-800 rounded-full 
                        flex items-center justify-center"
        >
          <span
            className="text-4xl text-gray-400 dark:text-gray-500"
            aria-hidden="true"
          >
            🚀
          </span>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          ¡Hora de empezar!
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Crea tu primera tarea para organizar tu día y ser más productivo.
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <div
        className={`gap-4 ${
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2"
            : "flex flex-col"
        }`}
        role="list"
        aria-label="Lista de tareas"
      >
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => {
            const cardProps = {
              task,
              onDelete: onDeleteTask,
              onEdit: handleEditTask,
              onUpdateCategory: onUpdateCategory,
            };

            if (viewMode === "grid") {
              return <StickyNoteCard key={task.id} {...cardProps} />;
            } else {
              return <ListCard key={task.id} {...cardProps} />;
            }
          })}
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
