"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <section className="mb-8" aria-labelledby="progress-heading">
      <div className="flex justify-between items-center mb-2">
        <h3 id="progress-heading" className="text-sm font-medium text-primary">
          Progreso General De Las Tareas
        </h3>
        <span className="text-sm font-semibold text-primary">{progress}%</span>
      </div>

      <div
        className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progreso de tareas completadas: ${progress}%`}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </section>
  );
};
