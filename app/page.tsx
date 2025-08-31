"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, ListTodo, StickyNote, LayoutList } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { useTheme } from "@/hooks/useTheme";
import { filterTasks } from "@/lib/taskUtils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Statistics } from "@/components/Statistics";
import { ProgressBar } from "@/components/ProgressBar";
import { FilterButtons } from "@/components/FilterButtons";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import type { FilterType } from "@/types";

export default function Home() {
  const {
    tasks,
    isLoading,
    addTask,
    deleteTask,
    updateTask,
    updateTaskCategory,
    getTaskStats,
  } = useTasks();
  const { theme, isLoading: themeLoading } = useTheme();
  const [activeFilter, setActiveFilter] = useState<FilterType>("todas");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  if (isLoading || themeLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const filteredTasks = filterTasks(tasks, activeFilter);
  const stats = getTaskStats();

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
                       bg-blue-600 text-white px-4 py-2 rounded-lg z-50"
        >
          Saltar al contenido principal
        </a>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-7"
          role="banner"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-indigo-600 rounded-xl shadow-lg">
              <ListTodo className="w-9 h-9 text-white" aria-hidden="true" />
            </div>
            <div>
              <h1
                className="text-2xl sm:text-3xl font-bold text-primary"
                id="app-title"
              >
                Gestión Tareas UC
              </h1>
              <p className="text-muted-foreground">Producto Académico 1</p>
            </div>
          </div>
          <ThemeToggle />
        </motion.div>

        <Statistics stats={stats} />

        <ProgressBar progress={stats.completionRate} />

        <section aria-labelledby="add-task-section">
          <h2 id="add-task-section" className="sr-only">
            Crear Nueva Tarea
          </h2>
          <TaskForm onSubmit={addTask} />
        </section>

        <FilterButtons
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        <motion.main
          id="main-content"
          role="main"
          aria-labelledby="task-list-heading"
          tabIndex={-1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2
              id="task-list-heading"
              className="text-xl font-semibold text-primary"
            >
              {activeFilter === "todas"
                ? "Todas las Tareas"
                : `Tareas: ${
                    activeFilter === "por-hacer"
                      ? "Por Hacer"
                      : activeFilter === "en-progreso"
                      ? "En Progreso"
                      : "Completadas"
                  }`}
            </h2>
            <div className="flex items-center gap-4">
              <span
                className="text-sm text-gray-500 dark:text-gray-400"
                aria-live="polite"
              >
                {filteredTasks.length}{" "}
                {filteredTasks.length === 1 ? "tarea" : "tareas"}
              </span>
              <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 p-1 gap-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                      : "text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                  aria-label="Cambiar a vista de tarjeta"
                >
                  <StickyNote className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                      : "text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                  aria-label="Cambiar a vista de lista"
                >
                  <LayoutList className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <TaskList
            tasks={filteredTasks}
            onDeleteTask={deleteTask}
            onUpdateCategory={updateTaskCategory}
            onUpdateTask={updateTask}
            viewMode={viewMode}
          />
        </motion.main>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 text-center text-muted-foreground text-sm"
          role="contentinfo"
        >
          <p>© 2025 Gestión Tareas Universidad Continental</p>
        </motion.footer>
      </div>
    </div>
  );
}
