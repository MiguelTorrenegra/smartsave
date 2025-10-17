import { useState } from "react";
import { useAuthStore } from "../store/auth";
import { useIncomeStore } from "../store/incomes";

export default function Dashboard() {
  const { user } = useAuthStore();
  const { getFor, addIncome, clearAll } = useIncomeStore();

  const incomes = user ? getFor(user.id) : [];

  const [form, setForm] = useState({
    reason: "",
    date: "",
    amount: "",
  });
  const [err, setErr] = useState(null);

  const submit = (e) => {
    e.preventDefault();
    setErr(null);
    if (!form.reason || !form.date || !form.amount) {
      setErr("Por favor completa todos los campos.");
      return;
    }
    // ahora guardamos asociado al usuario
    addIncome(user.id, form);
    setForm({ reason: "", date: "", amount: "" });
  };

  const onClearAll = () => clearAll(user.id);

  return (
    <div className="max-w-2xl mx-auto grid gap-6">
      {/* Encabezado */}
      <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <h2 className="text-xl font-semibold">
          Hola, {user?.name?.split(" ")[0]} 👋
        </h2>
        <p className="text-slate-400">Registra tus ingresos aquí</p>
      </section>

      {/* Formulario */}
      <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <h3 className="font-medium mb-3">Registrar nuevo ingreso</h3>
        <form onSubmit={submit} className="grid gap-3 sm:grid-cols-3">
          <input
            type="date"
            className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <input
            placeholder="Concepto (ej. Sueldo)"
            className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700"
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
          />
          <input
            type="number"
            placeholder="Monto"
            className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <button
            className="sm:col-span-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg py-2 mt-2"
            type="submit"
          >
            Agregar ingreso
          </button>
        </form>
        {err && <p className="text-rose-400 text-sm mt-2">{err}</p>}
      </section>

      {/* Tabla de ingresos */}
      <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">Lista de ingresos</h3>
          {incomes.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-sm px-3 py-1.5 rounded-md border border-slate-700 hover:bg-slate-800"
            >
              Limpiar todo
            </button>
          )}
        </div>

        {incomes.length === 0 ? (
          <p className="text-slate-400">No hay ingresos registrados aún.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-700 text-left">
                <th className="py-2">Fecha</th>
                <th>Concepto</th>
                <th className="text-right">Monto</th>
              </tr>
            </thead>
            <tbody>
              {incomes.map((inc) => (
                <tr
                  key={inc.id}
                  className="border-b border-slate-800 hover:bg-slate-800/40"
                >
                  <td className="py-2">{inc.date}</td>
                  <td>{inc.reason}</td>
                  <td className="text-right text-emerald-400 font-medium">
                    ${inc.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
