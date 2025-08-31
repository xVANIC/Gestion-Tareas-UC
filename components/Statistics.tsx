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
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    },
    {
      label: "Pendientes",
      value: stats.porHacer,
      icon: AlertCircle,
      color: "text-slate-600 dark:text-slate-400",
      bgColor: "bg-slate-50 dark:bg-slate-900/20",
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
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    },
  ];

  return (
    <section
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6"
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
