import { create } from "zustand";
import { supabase } from "../supabaseClient";

export const useMovementStore = create((set, get) => ({
  // Mapa: { [userId]: Movement[] }
  movementsByUser: {},

  // Cargar movimientos desde Supabase
  async loadFor(userId) {
    if (!userId) return;

    const { data, error } = await supabase
      .from("movements")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: true });

    if (error) {
      console.error("Error cargando movimientos:", error);
      return;
    }

    const items = (data || []).map((r) => ({
      id: r.id,
      type: r.type,
      description: r.description,
      date: r.date,
      amount: Number(r.amount),
    }));

    set((state) => ({
      movementsByUser: {
        ...(state.movementsByUser || {}),
        [userId]: items,
      },
    }));
  },

  // Obtener lista de un usuario
  getFor(userId) {
    const all = get().movementsByUser || {};
    return all[userId] || [];
  },

  // Agregar movimiento (egreso, ingreso, meta, etc.)
  async addMovement(userId, { type, amount, description, date }) {
    const a = Number(amount);
    if (!userId || !type || !date || !a || a <= 0) return;

    const newId = crypto.randomUUID(); // 👈 generamos id

    const { data, error } = await supabase
      .from("movements")
      .insert({
        id: newId,        // 👈 le mandamos id
        user_id: userId,
        type,
        description,
        date,
        amount: a,
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error creando movimiento en Supabase:", error);
      alert("No se pudo guardar el movimiento en la nube.");
      return;
    }

    const newMov = {
      id: newId, // usamos el mismo id
      type,
      description,
      date,
      amount: a,
    };

    const all = { ...(get().movementsByUser || {}) };
    const list = all[userId] || [];
    all[userId] = [...list, newMov];
    set({ movementsByUser: all });
  },
  
  // Total de egresos por usuario
  totalExpenses(userId) {
    const list = get().getFor(userId);
    return list
      .filter((m) => m.type === "egreso")
      .reduce((sum, m) => sum + m.amount, 0);
  },

  // Limpiar movimientos de un usuario
  clearAll(userId) {
    const all = { ...(get().movementsByUser || {}) };
    all[userId] = [];
    set({ movementsByUser: all });
  },
}));
