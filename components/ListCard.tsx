"use client";

import { motion } from "framer-motion";
import {
  Trash2,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  MoreVertical,
  Pencil,
} from "lucide-react";
import { useState } from "react";
import type { Task, TaskCategory } from "@/types";
import { getCategoryLabel, formatDate, isTaskOverdue } from "@/lib/taskUtils";

interface ListCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onUpdateCategory: (id: string, category: TaskCategory) => void;
}

export const ListCard = ({
  task,
  onDelete,
  onEdit,
  onUpdateCategory,
}: ListCardProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const isOverdue = isTaskOverdue(task);
  const isCompleted = task.category === "hecho";

  const handleCategoryChange = (newCategory: TaskCategory) => {
    if (newCategory !== task.category) {
      onUpdateCategory(task.id, newCategory);
    }
    setShowMenu(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  };

  const getStatusConfig = () => {
    switch (task.category) {
      case "hecho":
        return {
          icon: CheckCircle2,
          color: "text-emerald-500",
          bgColor: "bg-emerald-100 dark:bg-emerald-900/50",
          borderColor: "border-emerald-300 dark:border-emerald-700",
        };
      case "en-progreso":
        return {
          icon: Clock,
          color: "text-amber-500",
          bgColor: "bg-amber-100 dark:bg-amber-900/50",
          borderColor: "border-amber-300 dark:border-amber-700",
        };
      default:
        return {
          icon: Circle,
          color: "text-slate-400 dark:text-slate-500",
          bgColor: "bg-slate-100 dark:bg-slate-700/50",
          borderColor: "border-slate-300 dark:border-slate-600",
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`
        relative group bg-white dark:bg-slate-800/50 backdrop-blur-sm
        border-2 ${statusConfig.borderColor} rounded-xl p-4
        hover:shadow-md hover:shadow-slate-200 dark:hover:shadow-slate-900
        transition-all duration-300 ease-out flex flex-col gap-4
        ${isCompleted ? "opacity-80" : ""}
        ${
          isOverdue && !isCompleted
            ? "ring-2 ring-red-200 dark:ring-red-800/50"
            : ""
        }
        ${showMenu ? "z-50" : "z-10"}
      `}
      role="article"
      aria-label={`Tarea: ${task.title}`}
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <motion.button
          onClick={() => {
            const nextCategory =
              task.category === "por-hacer"
                ? "en-progreso"
                : task.category === "en-progreso"
                ? "hecho"
                : "por-hacer";
            handleCategoryChange(nextCategory);
          }}
          onKeyDown={(e) =>
            handleKeyDown(e, () => {
              const nextCategory =
                task.category === "por-hacer"
                  ? "en-progreso"
                  : task.category === "en-progreso"
                  ? "hecho"
                  : "por-hacer";
              handleCategoryChange(nextCategory);
            })
          }
          className={`
            flex-shrink-0 w-8 h-8 rounded-lg ${statusConfig.bgColor}
            flex items-center justify-center transition-all duration-200
            hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-primary 
            ${statusConfig.color}
          `}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label={`Cambiar estado de tarea. Estado actual: ${getCategoryLabel(
            task.category
          )}`}
        >
          <StatusIcon className="w-5 h-5" />
        </motion.button>

        <div className="flex-1 min-w-0">
          <h3
            className={`
              text-base font-semibold leading-tight
              ${
                isCompleted
                  ? "text-slate-500/70 dark:text-slate-400/70 line-through"
                  : "text-slate-900/70 dark:text-slate-100/70"
              }
            `}
          >
            {task.title}
          </h3>
          <p
            className={`
              text-sm leading-tight mt-1
              ${
                isCompleted
                  ? "text-slate-400/70 dark:text-slate-500/70 line-through"
                  : "text-slate-600/70 dark:text-slate-400/70"
              }
            `}
          >
            {task.description || "Sin descripción"}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700/50">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`
              inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium
              ${statusConfig.bgColor} ${statusConfig.color}
              border ${statusConfig.borderColor}
            `}
          >
            {getCategoryLabel(task.category)}
          </span>
          {task.dueDate && (
            <div
              className={`
                flex items-center gap-1.5 text-xs
                ${
                  isOverdue && !isCompleted
                    ? "text-red-600 dark:text-red-400 font-medium"
                    : "text-slate-500 dark:text-slate-400"
                }
              `}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
          <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span className="truncate">{formatDate(task.createdAt)}</span>
          </div>
        </div>

        <div className="relative ml-2 flex-shrink-0">
          <motion.button
            onClick={() => setShowMenu(!showMenu)}
            onKeyDown={(e) => handleKeyDown(e, () => setShowMenu(!showMenu))}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300
                       hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg
                       transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Abrir menú de acciones"
            aria-expanded={showMenu}
          >
            <MoreVertical className="w-5 h-5" />
          </motion.button>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-slate-800
                           border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl
                           py-1.5 z-50 text-center"
              role="menu"
              aria-label="Menú de acciones de tarea"
            >
              <button
                onClick={() => {
                  onEdit(task);
                  setShowMenu(false);
                }}
                onKeyDown={(e) =>
                  handleKeyDown(e, () => {
                    onEdit(task);
                    setShowMenu(false);
                  })
                }
                className="w-full px-3 py-1.5 text-left text-sm text-blue-600 dark:text-blue-400
                             hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors duration-150
                             flex items-center gap-3 focus:outline-none focus:bg-blue-50 dark:focus:bg-blue-950/30 justify-center"
                role="menuitem"
              >
                <Pencil className="w-4 h-4" />
                Editar tarea
              </button>
              <button
                onClick={() => {
                  onDelete(task.id);
                  setShowMenu(false);
                }}
                onKeyDown={(e) =>
                  handleKeyDown(e, () => {
                    onDelete(task.id);
                    setShowMenu(false);
                  })
                }
                className="w-full px-3 py-1.5 text-left text-sm text-red-600 dark:text-red-400
                             hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors duration-150
                             flex items-center gap-3 focus:outline-none focus:bg-red-50 dark:focus:bg-red-950/30 justify-center"
                role="menuitem"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar tarea
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.article>
  );
};
