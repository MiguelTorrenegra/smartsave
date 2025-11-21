import { create } from "zustand";
import { supabase } from "../supabaseClient";

export const useGoalStore = create((set, get) => ({
  // { [userId]: Goal[] }
  goalsByUser: {},

  // Cargar metas desde Supabase
  async loadFor(userId) {
    if (!userId) return;

    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", userId)
      .order("date_created", { ascending: true });

    if (error) {
      console.error("Error cargando metas:", error);
      return;
    }

    const goals = (data || []).map((g) => ({
      id: g.id,
      title: g.title,
      targetAmount: Number(g.target_amount),
      savedAmount: Number(g.saved_amount),
      image: g.image_url || null,
      dateCreated: g.date_created,
    }));

    set((state) => ({
      goalsByUser: { ...(state.goalsByUser || {}), [userId]: goals },
    }));
  },

  // Obtener metas del usuario
  getFor(userId) {
    const all = get().goalsByUser || {};
    return all[userId] || [];
  },

  // Crear meta nueva
  async addGoal(userId, { title, targetAmount, image }) {
    const t = Number(targetAmount);
    if (!userId || !title || !t || t <= 0) return;

    const id = crypto.randomUUID();
    const dateCreated = new Date().toISOString().slice(0, 10);

    const { error } = await supabase.from("goals").insert({
      id,
      user_id: userId,
      title,
      target_amount: t,
      saved_amount: 0,
      image_url: image || null,
      date_created: dateCreated,
    });

    if (error) {
      console.error("Error creando meta:", error);
      alert("No se pudo guardar la meta en la nube.");
      return;
    }

    const all = { ...(get().goalsByUser || {}) };
    const list = all[userId] || [];
    all[userId] = [
      ...list,
      {
        id,
        title,
        targetAmount: t,
        savedAmount: 0,
        image: image || null,
        dateCreated,
      },
    ];
    set({ goalsByUser: all });
  },

  // Añadir dinero a una meta
  async addToGoal(userId, goalId, amount) {
    const a = Number(amount);
    if (!userId || !goalId || !a || a <= 0) return;

    const goals = get().getFor(userId);
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;

    const newSaved = goal.savedAmount + a;

    const { error } = await supabase
      .from("goals")
      .update({ saved_amount: newSaved })
      .eq("id", goalId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error actualizando meta:", error);
      alert("No se pudo actualizar la meta en la nube.");
      return;
    }

    const updated = goals.map((g) =>
      g.id === goalId ? { ...g, savedAmount: newSaved } : g
    );

    set((state) => ({
      goalsByUser: { ...(state.goalsByUser || {}), [userId]: updated },
    }));
  },

  // Total ahorrado en metas
  totalSaved(userId) {
    const list = get().getFor(userId);
    return list.reduce((sum, g) => sum + g.savedAmount, 0);
  },
}));
