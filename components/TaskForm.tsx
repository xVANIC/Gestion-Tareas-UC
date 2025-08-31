"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Calendar, AlertCircle } from "lucide-react";
import type { TaskFormData, TaskCategory } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface TaskFormProps {
  onSubmit: (task: TaskFormData) => void;
}

interface FormError {
  title?: string;
  description?: string;
  dueDate?: string;
}

export const TaskForm = ({ onSubmit }: TaskFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<FormError>({});
  const { toast } = useToast();

  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    category: "por-hacer",
  });

  const validateForm = (): boolean => {
    const errors: FormError = {};
    let isValid = true;

    if (!formData.title.trim()) {
      errors.title = "El título es obligatorio";
      isValid = false;
    } else if (formData.title.trim().length > 100) {
      errors.title = "El título no puede tener más de 100 caracteres";
      isValid = false;
    }

    if (formData.description && formData.description.length > 500) {
      errors.description =
        "La descripción no puede tener más de 500 caracteres";
      isValid = false;
    }

    if (formData.dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dueDate = new Date(formData.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      if (dueDate < today) {
        errors.dueDate = "La fecha límite no puede ser anterior a hoy";
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "por-hacer",
    });
    setFormErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Error de validación",
        description: "Por favor, corrige los errores en el formulario",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await Promise.resolve(
        onSubmit({
          ...formData,
          dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        })
      );

      toast({
        title: "¡Tarea creada!",
        description: "La tarea se ha creado correctamente",
      });

      resetForm();
      setIsOpen(false);
    } catch (error) {
      console.error("Error al crear la tarea:", error);
      toast({
        title: "Error al crear la tarea",
        description:
          "Ocurrió un error al crear la tarea. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories: { value: TaskCategory; label: string }[] = [
    { value: "por-hacer", label: "Pendiente" },
    { value: "en-progreso", label: "En Progreso" },
    { value: "hecho", label: "Hecho" },
  ];

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="w-full mb-4 p-2.5 rounded-xl
             bg-gradient-to-r from-indigo-600 to-cyan-500
             text-white font-medium shadow-lg
             flex items-center justify-center gap-2
             transition-all duration-200
             group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className="flex items-center gap-2"
          initial={{ x: -5 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
          <span>Agregar Nueva Tarea</span>
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => {
              if (!isSubmitting) {
                setIsOpen(false);
                resetForm();
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Crear Nueva Tarea
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="Cerrar formulario"
                >
                  <X className="w-5 h-5 text-gray-500" aria-hidden="true" />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-3.5"
                role="form"
                aria-label="Formulario para crear nueva tarea"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }));
                      if (formErrors.title) {
                        setFormErrors((prev) => ({
                          ...prev,
                          title: undefined,
                        }));
                      }
                    }}
                    className={`w-full p-3 border rounded-lg
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             transition-all duration-200 ${
                               formErrors.title
                                 ? "border-red-500 dark:border-red-400"
                                 : "border-gray-300 dark:border-gray-600"
                             }`}
                    placeholder="Escribe el título de la tarea..."
                    required
                    maxLength={100}
                    aria-describedby="title-error"
                    autoComplete="off"
                    disabled={isSubmitting}
                  />
                  {formErrors.title && (
                    <p
                      id="title-error"
                      className="mt-1 text-sm text-red-500 dark:text-red-400 flex items-center gap-1"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }));
                      if (formErrors.description) {
                        setFormErrors((prev) => ({
                          ...prev,
                          description: undefined,
                        }));
                      }
                    }}
                    className={`w-full p-3 border rounded-lg
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             transition-all duration-200 resize-none ${
                               formErrors.description
                                 ? "border-red-500 dark:border-red-400"
                                 : "border-gray-300 dark:border-gray-600"
                             }`}
                    rows={3}
                    maxLength={500}
                    placeholder="Descripción de la tarea, esto es opcional..."
                    aria-describedby="description-error"
                    autoComplete="off"
                    disabled={isSubmitting}
                  />
                  {formErrors.description && (
                    <p
                      id="description-error"
                      className="mt-1 text-sm text-red-500 dark:text-red-400 flex items-center gap-1"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.description}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {formData.description?.length || 0}/500 caracteres
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Categoría
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value as TaskCategory,
                      }))
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             transition-all duration-200"
                    aria-describedby="category-help"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    <Calendar
                      className="w-4 h-4 inline mr-1"
                      aria-hidden="true"
                    />
                    Fecha límite (opcional)
                  </label>
                  <input
                    type="date"
                    value={
                      formData.dueDate
                        ? formData.dueDate.toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        dueDate: e.target.value
                          ? new Date(e.target.value)
                          : undefined,
                      }));
                      if (formErrors.dueDate) {
                        setFormErrors((prev) => ({
                          ...prev,
                          dueDate: undefined,
                        }));
                      }
                    }}
                    className={`w-full p-3 border rounded-lg
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             transition-all duration-200 ${
                               formErrors.dueDate
                                 ? "border-red-500 dark:border-red-400"
                                 : "border-gray-300 dark:border-gray-600"
                             }`}
                    aria-describedby="date-error"
                    min={new Date().toISOString().split("T")[0]}
                    disabled={isSubmitting}
                  />
                  {formErrors.dueDate && (
                    <p
                      id="date-error"
                      className="mt-1 text-sm text-red-500 dark:text-red-400 flex items-center gap-1"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.dueDate}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    type="button"
                    onClick={() => {
                      if (!isSubmitting) {
                        setIsOpen(false);
                        resetForm();
                      }
                    }}
                    className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300
                             rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600
                             transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    aria-label="Cancelar creación de tarea"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white
                             rounded-lg font-medium shadow-lg transition-colors duration-200
                             disabled:opacity-50 disabled:cursor-not-allowed
                             flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    aria-label="Crear nueva tarea"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Creando...
                      </>
                    ) : (
                      "Crear Tarea"
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
