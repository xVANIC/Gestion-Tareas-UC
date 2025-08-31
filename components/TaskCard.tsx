"use client";

import { motion } from "framer-motion";
import {
  Trash2,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  MoreVertical,
  AlertTriangle,
  CheckCircle,
  Pencil,
} from "lucide-react";
import { useState } from "react";
import type { Task, TaskCategory } from "@/types";
import { getCategoryLabel, formatDate, isTaskOverdue } from "@/lib/taskUtils";

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onUpdateCategory: (id: string, category: TaskCategory) => void;
}

export const TaskCard = ({
  task,
  onDelete,
  onEdit,
  onUpdateCategory,
}: TaskCardProps) => {
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
          color: "text-emerald-600 dark:text-emerald-400",
          bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
          borderColor: "border-emerald-200 dark:border-emerald-800",
          accentColor: "bg-emerald-500",
        };
      case "en-progreso":
        return {
          icon: Clock,
          color: "text-amber-600 dark:text-amber-400",
          bgColor: "bg-amber-50 dark:bg-amber-950/30",
          borderColor: "border-amber-200 dark:border-amber-800",
          accentColor: "bg-amber-500",
        };
      default:
        return {
          icon: Circle,
          color: "text-slate-500 dark:text-slate-400",
          bgColor: "bg-slate-50 dark:bg-slate-950/30",
          borderColor: "border-slate-200 dark:border-slate-700",
          accentColor: "bg-slate-400",
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
        border ${
          statusConfig.borderColor
        } rounded-2xl overflow-hidden aspect-square
        hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-slate-900/40
        transition-all duration-300 ease-out
        ${isCompleted ? "opacity-80" : ""}
        ${
          isOverdue && !isCompleted
            ? "ring-2 ring-red-200 dark:ring-red-800/50"
            : ""
        }
      `}
      role="article"
      aria-label={`Tarea: ${task.title}`}
    >
      <div className={`h-1 ${statusConfig.accentColor}`} />

      <div className="p-6 flex flex-col h-[calc(100%-0.25rem)]">
        <div className="flex items-start gap-2">
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
              flex-shrink-0 w-10 h-10 rounded-xl ${statusConfig.bgColor}
              flex items-center justify-center transition-all duration-200
              hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 
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

          <div className="flex-1 min-w-0 flex items-center justify-between">
            <h3
              className={`
                text-lg font-semibold leading-tight
                ${
                  isCompleted
                    ? "text-slate-500 dark:text-slate-400 line-through"
                    : "text-slate-900 dark:text-slate-100"
                }
              `}
            >
              {task.title}
            </h3>

            <div className="relative ml-2">
              <motion.button
                onClick={() => setShowMenu(!showMenu)}
                onKeyDown={(e) =>
                  handleKeyDown(e, () => setShowMenu(!showMenu))
                }
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
                             py-1.5 z-10 text-center"
                  role="menu"
                  aria-label="Menú de acciones de tarea"
                >
                  {(
                    ["por-hacer", "en-progreso", "hecho"] as TaskCategory[]
                  ).map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      onKeyDown={(e) =>
                        handleKeyDown(e, () => handleCategoryChange(category))
                      }
                      className={`
                          w-full px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50
                          transition-colors duration-150 flex items-center gap-3 justify-center
                          ${
                            task.category === category
                              ? "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300"
                              : "text-slate-700 dark:text-slate-300"
                          }
                          focus:outline-none focus:bg-slate-50 dark:focus:bg-slate-700/50
                        `}
                      role="menuitem"
                    >
                      <div
                        className={`
                            w-2 h-2 rounded-full
                            ${
                              category === "por-hacer"
                                ? "bg-slate-400"
                                : category === "en-progreso"
                                ? "bg-amber-400"
                                : "bg-emerald-400"
                            }
                          `}
                      />
                      {getCategoryLabel(category)}
                    </button>
                  ))}

                  <div className="border-t border-slate-100 dark:border-slate-700 pt-2">
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
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto mt-4 mb-4 border-t border-slate-100 dark:border-slate-700/50 pt-4">
          {task.description ? (
            <p
              className={`
                text-sm leading-relaxed
                ${
                  isCompleted
                    ? "text-slate-400 dark:text-slate-500"
                    : "text-slate-600 dark:text-slate-400"
                }
              `}
            >
              {task.description}
            </p>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-300 dark:text-slate-600 text-sm italic">
              Sin descripción
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50">
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
                {isOverdue && !isCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1 ml-1 px-2 py-0.5 bg-red-100 dark:bg-red-900/30 
                             text-red-700 dark:text-red-300 rounded-full"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    <span className="text-xs font-medium">Vencida</span>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span className="truncate">{formatDate(task.createdAt)}</span>
          </div>
        </div>

        {isCompleted && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="absolute -top-2 -right-2 w-9 h-9 bg-emerald-500 rounded-full
                     flex items-center justify-center shadow-lg"
          >
            <CheckCircle className="w-6 h-6 text-white" />
          </motion.div>
        )}
      </div>

      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(false)}
          aria-hidden="true"
        />
      )}
    </motion.article>
  );
};
