"use client";

import { motion } from "framer-motion";
import { CheckCircle, Clock, AlertCircle, BarChart3 } from "lucide-react";
import type { TaskStats } from "@/types";

interface StatisticsProps {
  stats: TaskStats;
}

export const Statistics = ({ stats }: StatisticsProps) => {
  const statItems = [
    {
      label: "Total",
      value: stats.total,
      icon: BarChart3,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Pendientes",
      value: stats.porHacer,
      icon: AlertCircle,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      label: "En Progreso",
      value: stats.enProgreso,
      icon: Clock,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    },
    {
      label: "Completadas",
      value: stats.hecho,
      icon: CheckCircle,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
  ];

  return (
    <section
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8"
      aria-labelledby="statistics-heading"
    >
      <h2 id="statistics-heading" className="sr-only">
        Estadísticas de tareas
      </h2>
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`${item.bgColor} p-4 rounded-xl border border-muted-foreground/50`}
          role="status"
          aria-label={`${item.label}: ${item.value} tareas`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {item.label}
              </p>
              <motion.p
                key={item.value}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`text-2xl font-bold ${item.color}`}
              >
                {item.value}
              </motion.p>
            </div>
            <item.icon className={`w-6 h-6 ${item.color}`} aria-hidden="true" />
          </div>
        </motion.div>
      ))}
    </section>
  );
};
