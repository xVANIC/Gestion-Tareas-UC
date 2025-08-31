"use client";

import { motion } from "framer-motion";
import { ListTodo, AlertCircle, Clock, CheckCircle } from "lucide-react";
import type { FilterType } from "@/types";

interface FilterButtonsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const FilterButtons = ({
  activeFilter,
  onFilterChange,
}: FilterButtonsProps) => {
  const filters = [
    { key: "todas" as FilterType, label: "Todas", icon: ListTodo },
    { key: "por-hacer" as FilterType, label: "Pendientes", icon: AlertCircle },
    { key: "en-progreso" as FilterType, label: "En Progreso", icon: Clock },
    { key: "hecho" as FilterType, label: "Hecho", icon: CheckCircle },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6 justify-center">
      {filters.map((filter) => (
        <motion.button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onFilterChange(filter.key);
            }
          }}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
            transition-all duration-200 relative overflow-hidden
            ${
              activeFilter === filter.key
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-pressed={activeFilter === filter.key}
          aria-label={`Filtrar por ${filter.label}`}
        >
          {activeFilter === filter.key && (
            <motion.div
              layoutId="activeFilter"
              className="absolute inset-0 bg-blue-600 rounded-lg"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}

          <filter.icon className="w-4 h-4 relative z-10" aria-hidden="true" />
          <span className="relative z-10">{filter.label}</span>
        </motion.button>
      ))}
    </div>
  );
};
