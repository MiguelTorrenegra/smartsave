import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useGoalStore = create(
  persist(
    (set) => ({
      goal: 0,                     // meta de ahorro
      setGoal: (v) => set({ goal: Number(v) || 0 }),
    }),
    { name: "finova_goal" }        // clave en localStorage
  )
);
