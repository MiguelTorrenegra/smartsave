import { create } from "zustand";
import { supabase } from "../supabaseClient";

export const useObligationsStore = create((set, get) => ({
  // { [userId]: Obligation[] }
  obligationsByUser: {},

  // Cargar obligaciones desde Supabase
  async loadFor(userId) {
    if (!userId) return;

    const { data, error } = await supabase
      .from("obligations")
      .select("*")
      .eq("user_id", userId)
      .order("due_date", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error cargando obligaciones:", error);
      return;
    }

    const obligations = (data || []).map((o) => ({
      id: o.id,
      title: o.title,
      description: o.description || "",
      dueDate: o.due_date,
      amount: Number(o.amount),
      isPaid: o.is_paid,
      createdAt: o.created_at,
      paidAt: o.paid_at,
    }));

    set((state) => ({
      obligationsByUser: {
        ...(state.obligationsByUser || {}),
        [userId]: obligations,
      },
    }));
  },

  // Obtener solo obligaciones pendientes
  getPending(userId) {
    const all = get().obligationsByUser || {};
    const list = all[userId] || [];
    return list.filter((o) => !o.isPaid);
  },

  // Crear nueva obligación
  async addObligation(userId, { title, description, dueDate, amount }) {
    const a = Number(amount);
    if (!userId || !title || !dueDate || !a || a <= 0) {
      alert("Completa título, fecha y monto válido.");
      return;
    }

    const id = crypto.randomUUID();

    const { error } = await supabase.from("obligations").insert({
      id,
      user_id: userId,
      title,
      description: description || null,
      due_date: dueDate,
      amount: a,
      is_paid: false,
      paid_at: null,
    });

    if (error) {
      console.error("Error creando obligación:", error);
      alert("No se pudo guardar la obligación en la nube.");
      return;
    }

    const all = { ...(get().obligationsByUser || {}) };
    const list = all[userId] || [];
    all[userId] = [
      ...list,
      {
        id,
        title,
        description: description || "",
        dueDate,
        amount: a,
        isPaid: false,
        createdAt: new Date().toISOString(),
        paidAt: null,
      },
    ];
    set({ obligationsByUser: all });
  },

  // Marcar obligación como pagada (el “eliminar” estético)
  async markAsPaid(userId, obligationId) {
    if (!userId || !obligationId) return;

    const paidAt = new Date().toISOString();

    const { error } = await supabase
      .from("obligations")
      .update({ is_paid: true, paid_at: paidAt })
      .eq("id", obligationId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error marcando obligación como pagada:", error);
      alert("No se pudo actualizar la obligación en la nube.");
      return;
    }

    const all = { ...(get().obligationsByUser || {}) };
    const list = all[userId] || [];
    const updated = list.map((o) =>
      o.id === obligationId ? { ...o, isPaid: true, paidAt } : o
    );
    all[userId] = updated;
    set({ obligationsByUser: all });
  },
}));
