"use client"; // Indica que este componente se ejecuta en el cliente (Next.js)

import { motion } from "framer-motion"; // Librería para animaciones
import {
  ListTodo,
  AlertCircle,
  Clock,
  CheckCircle,
  CalendarDays,
} from "lucide-react"; // Iconos
import type { FilterType } from "@/types"; // Tipo para los filtros

// Propiedades que recibe el componente
interface FilterButtonsProps {
  activeFilter: FilterType; // Filtro activo en este momento
  onFilterChange: (filter: FilterType) => void; // Función para cambiar filtro
}

// Componente principal
export const FilterButtons = ({
  activeFilter,
  onFilterChange,
}: FilterButtonsProps) => {
  // Definición de filtros disponibles
  const filters = [
    { key: "todas" as FilterType, label: "Todas", icon: ListTodo },
    { key: "por-hacer" as FilterType, label: "Pendientes", icon: AlertCircle },
    { key: "en-progreso" as FilterType, label: "En Progreso", icon: Clock },
    { key: "hecho" as FilterType, label: "Hecho", icon: CheckCircle },
    { key: "por-fecha" as FilterType, label: "Por Fecha", icon: CalendarDays },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6 justify-center">
      {/* Recorre cada filtro y genera un botón */}
      {filters.map((filter) => (
        <motion.button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)} // Cambia el filtro al hacer clic
          onKeyDown={(e) => {
            // Permite cambiar con teclado (Enter o Espacio)
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onFilterChange(filter.key);
            }
          }}
          // Estilos: cambia apariencia si está activo o no
          className={`
            flex items-center gap-2 p-2 rounded-lg text-sm font-medium
            transition-all duration-200 relative overflow-hidden border border-muted-foreground/50
            ${
              activeFilter === filter.key
                ? "bg-indigo-600 text-white shadow-lg" // Activo
                : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" // Inactivo
            }
          `}
          whileHover={{ scale: 1.02 }} // Animación al pasar el mouse
          whileTap={{ scale: 0.98 }} // Animación al hacer clic
          aria-pressed={activeFilter === filter.key} // Accesibilidad
          aria-label={`Filtrar por ${filter.label}`}
        >
          {/* Efecto visual del filtro activo */}
          {activeFilter === filter.key && (
            <motion.div
              layoutId="activeFilter"
              className="absolute inset-0 bg-blue-600 rounded-lg"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}

          {/* Ícono del filtro */}
          <filter.icon className="w-4 h-4 relative z-10" aria-hidden="true" />
          {/* Texto del filtro */}
          <span className="relative z-10">{filter.label}</span>
        </motion.button>
      ))}
    </div>
  );
};
