"use client";

import { useState, useEffect } from "react";
import type { Task, TaskFormData, TaskStats, TaskCategory } from "@/types";

const STORAGE_KEY = "gestion-tareas-uc";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEY);
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        }));
        setTasks(parsedTasks);
      }
    } catch (error) {
      console.error("Error loading tasks from localStorage:", error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, isLoading]);

  const addTask = (taskData: TaskFormData): Task => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      ...taskData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<TaskFormData>): void => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
      )
    );
  };

  const deleteTask = (id: string): void => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const updateTaskCategory = (id: string, category: TaskCategory): void => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, category, updatedAt: new Date() } : task
      )
    );
  };

  const getTaskStats = (): TaskStats => {
    const total = tasks.length;
    const porHacer = tasks.filter(
      (task) => task.category === "por-hacer"
    ).length;
    const enProgreso = tasks.filter(
      (task) => task.category === "en-progreso"
    ).length;
    const hecho = tasks.filter((task) => task.category === "hecho").length;
    const completionRate = total > 0 ? Math.round((hecho / total) * 100) : 0;

    return {
      total,
      porHacer,
      enProgreso,
      hecho,
      completionRate,
    };
  };

  return {
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    updateTaskCategory,
    getTaskStats,
  };
};
