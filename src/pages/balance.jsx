import { useState, useEffect } from "react";
import { useAuthStore } from "../store/auth";
import { useIncomeStore } from "../store/incomes";
import { useMovementStore } from "../store/movements";

export default function Balance() {
  const { user } = useAuthStore();
  const { getFor, total, addIncome, loadFor } = useIncomeStore();
  const { addMovement } = useMovementStore();

  const [form, setForm] = useState({
    reason: "",
    date: "",
    amount: "",
  });

  useEffect(() => {
    if (user) {
      loadFor(user.id); // 👈 trae ingresos desde Supabase
    }
  }, [user, loadFor]);

  if (!user) return null;

  const incomes = getFor(user.id);
  const totalValue = total(user.id);

  const handleAddIncome = async () => {
    const a = Number(form.amount);
    if (!a || a <= 0 || !form.reason || !form.date) {
      alert("Completa todos los campos con un monto válido.");
      return;
    }

    // 1) Guardar en Supabase + estado
    await addIncome(user.id, {
      reason: form.reason,
      date: form.date,
      amount: a,
    });

    // 2) Registrar movimiento (sigue siendo local o lo pasamos luego a nube)
    addMovement(user.id, {
      type: "ingreso",
      amount: a,
      description: form.reason,
      date: form.date,
    });

    setForm({ reason: "", date: "", amount: "" });
  };

  return (
    <div className="max-w-3xl mx-auto grid gap-6 p-6 text-white">
      {/* Título */}
      <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <h2 className="text-xl font-semibold">Balance general</h2>
        <p className="text-slate-400">Resumen y registro de tus ingresos</p>
      </section>

      {/* Total acumulado */}
      <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center">
        <h3 className="text-slate-400 text-sm">Total acumulado</h3>
        <p className="text-3xl font-bold text-emerald-400 mt-1">
          ${totalValue.toLocaleString()}
        </p>
        <div className="mt-4 text-sm text-slate-400">
          {incomes.length === 0
            ? "Aún no has registrado ingresos."
            : `Llevas ${incomes.length} registro${
                incomes.length > 1 ? "s" : ""
              } de ingresos.`}
        </div>
      </section>

      {/* Formulario de nuevo ingreso */}
      <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <h3 className="text-lg font-semibold mb-4">Registrar nuevo ingreso</h3>
        <div className="grid md:grid-cols-3 gap-3 mb-4">
          <input
            className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700"
            placeholder="Descripción"
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
          />
          <input
            type="date"
            className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <input
            type="number"
            className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700"
            placeholder="Monto"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
        </div>
        <button
          onClick={handleAddIncome}
          className="bg-indigo-600 hover:bg-indigo-500 rounded-lg px-4 py-2 font-medium"
        >
          Agregar ingreso
        </button>
      </section>

      {/* Lista de ingresos */}
      <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <h3 className="text-lg font-semibold mb-3">Ingresos registrados</h3>
        {incomes.length === 0 ? (
          <p className="text-slate-400 text-sm">
            No hay ingresos registrados todavía.
          </p>
        ) : (
          <div className="space-y-2">
            {incomes.map((inc) => (
              <div
                key={inc.id}
                className="flex justify-between items-center bg-slate-800 px-3 py-2 rounded-lg"
              >
                <div>
                  <p className="text-sm text-slate-400">{inc.date}</p>
                  <p className="font-medium">{inc.reason}</p>
                </div>
                <div className="text-emerald-400 font-semibold">
                  +${inc.amount}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
