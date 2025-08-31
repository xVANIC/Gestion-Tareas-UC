"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Task } from "@/types";
import { Button } from "./ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface TaskDialogProps {
  isOpen: boolean;
  task?: Task;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
}

export const TaskDialog = ({
  isOpen,
  task,
  onClose,
  onSave,
}: TaskDialogProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const updatedTask = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      dueDate: formData.get("dueDate")
        ? new Date(formData.get("dueDate") as string)
        : task?.dueDate,
    };

    onSave(updatedTask);
    onClose();
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              {task ? "Editar tarea" : "Nueva tarea"}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Título
              </label>
              <Input
                id="title"
                name="title"
                defaultValue={task?.title}
                required
                className="w-full"
                placeholder="Ingresa el título de la tarea"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Descripción
              </label>
              <Textarea
                id="description"
                name="description"
                defaultValue={task?.description}
                rows={4}
                className="w-full resize-none"
                placeholder="Ingresa una descripción (opcional)"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="dueDate"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Fecha de vencimiento
              </label>
              <Input
                type="date"
                id="dueDate"
                name="dueDate"
                defaultValue={task?.dueDate?.toISOString().split("T")[0]}
                className="w-full"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-24"
              >
                Cancelar
              </Button>
              <Button type="submit" className="w-24">
                Guardar
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
