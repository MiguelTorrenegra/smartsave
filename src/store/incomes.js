import { create } from "zustand";
import { supabase } from "../supabaseClient";

export const useIncomeStore = create((set, get) => ({
  // Mapa: { [userId]: Income[] }
  incomesByUser: {},

  // Cargar ingresos de Supabase para un usuario
  async loadFor(userId) {
    if (!userId) return;

    const { data, error } = await supabase
      .from("incomes")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: true });

    if (error) {
      console.error("Error cargando ingresos:", error);
      return;
    }

    const txs = (data || []).map((r) => ({
      id: r.id,
      reason: r.reason,
      date: r.date,
      amount: Number(r.amount),
    }));

    set((state) => ({
      incomesByUser: { ...(state.incomesByUser || {}), [userId]: txs },
    }));
  },

  // Obtener lista de un usuario (desde el estado ya cargado)
  getFor(userId) {
    const all = get().incomesByUser || {};
    return all[userId] || [];
  },

  // Agregar ingreso (en Supabase + estado)
  async addIncome(userId, { reason, date, amount }) {
    const a = Number(amount);
    if (!userId || !reason || !date || !a || a <= 0) return;

    const { data, error } = await supabase
      .from("incomes")
      .insert({
        user_id: userId,
        reason,
        date,
        amount: a,
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error creando ingreso en Supabase:", error);
      alert("No se pudo guardar el ingreso en la nube.");
      return;
    }

    const newTx = {
      id: data.id,
      reason: data.reason,
      date: data.date,
      amount: Number(data.amount),
    };

    const all = { ...(get().incomesByUser || {}) };
    const list = all[userId] || [];
    all[userId] = [...list, newTx];
    set({ incomesByUser: all });
  },

  // Total por usuario
  total(userId) {
    const list = get().getFor(userId);
    return list.reduce((sum, it) => sum + it.amount, 0);
  },

  // Limpiar ingresos locales (opcional)
  clearAll(userId) {
    const all = { ...(get().incomesByUser || {}) };
    all[userId] = [];
    set({ incomesByUser: all });
  },
}));
