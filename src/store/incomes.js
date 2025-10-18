import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useIncomeStore = create(
  persist(
    (set, get) => ({
      // Mapa: { [userId]: Income[] }
      incomesByUser: {},

      // Obtener lista de un usuario
      getFor: (userId) => {
        const all = get().incomesByUser || {};
        return all[userId] || [];
      },

      // Agregar ingreso para un usuario
      addIncome: (userId, { reason, date, amount }) => {
        const a = Number(amount);
        if (!userId || !reason || !date || !a || a <= 0) return;

        const tx = {
          id: crypto.randomUUID(),
          reason,
          date,
          amount: a,
        };

        const all = { ...(get().incomesByUser || {}) };
        const list = all[userId] || [];
        all[userId] = [...list, tx];
        set({ incomesByUser: all });
      },

      // Total por usuario
      total: (userId) => {
        const list = get().getFor(userId);
        return list.reduce((sum, it) => sum + it.amount, 0);
      },

      // Limpiar solo los ingresos del usuario actual
      clearAll: (userId) => {
        const all = { ...(get().incomesByUser || {}) };
        all[userId] = [];
        set({ incomesByUser: all });
      },
    }),
    { name: "finova_incomes_v2" } 
  )
);
