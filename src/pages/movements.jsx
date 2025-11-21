import { useState, useEffect } from "react";
import { useAuthStore } from "../store/auth";
import { useMovementStore } from "../store/movements";
import { useIncomeStore } from "../store/incomes";
import { useGoalStore } from "../store/goal";

export default function Movements() {
  const { user } = useAuthStore();
  const { getFor, addMovement, totalExpenses, loadFor } = useMovementStore();
  const { total } = useIncomeStore();
  const { totalSaved } = useGoalStore();

  const [egreso, setEgreso] = useState({
    amount: "",
    description: "",
  });

  useEffect(() => {
    if (user) {
      loadFor(user.id); // 👈 trae movimientos desde Supabase
    }
  }, [user, loadFor]);

  if (!user) return null;

  const movements = getFor(user.id);
  const totalIngresos = total(user.id);
  const gastos = totalExpenses(user.id);
  const ahorradoMetas = totalSaved(user.id);
  const saldoDisponible = totalIngresos - gastos - ahorradoMetas;

  const handleAddExpense = async () => {
    const a = Number(egreso.amount);
  if (!a || a <= 0) {
    alert("Monto inválido");
    return;
  }

  // 🚫 No dejar gastar más de lo disponible
  if (a > saldoDisponible) {
    alert("No tienes saldo suficiente para este egreso.");
    return;
  }

  await addMovement(user.id, {
    type: "egreso",
    amount: a,
    description: egreso.description || "Egreso",
    date: new Date().toISOString().slice(0, 10),
  });

  setEgreso({ amount: "", description: "" });
};
    
  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Movimientos</h1>

      {/* RESUMEN */}
      <div className="grid md:grid-cols-4 gap-3 mb-6">
        <div className="bg-slate-800 p-3 rounded-lg">
          <p className="text-sm text-slate-400">Ingresos</p>
          <p className="text-lg font-semibold text-green-400">
            ${totalIngresos}
          </p>
        </div>
        <div className="bg-slate-800 p-3 rounded-lg">
          <p className="text-sm text-slate-400">Egresos</p>
          <p className="text-lg font-semibold text-rose-400">${gastos}</p>
        </div>
        <div className="bg-slate-800 p-3 rounded-lg">
          <p className="text-sm text-slate-400">Ahorrado en metas</p>
          <p className="text-lg font-semibold text-indigo-400">
            ${ahorradoMetas}
          </p>
        </div>
        <div className="bg-slate-800 p-3 rounded-lg">
          <p className="text-sm text-slate-400">Saldo disponible</p>
          <p className="text-lg font-semibold text-emerald-400">
            ${saldoDisponible}
          </p>
        </div>
      </div>

      {/* FORM EGRESO */}
      <div className="mb-6 bg-slate-800 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Registrar egreso</h2>
        <input
          type="number"
          className="w-full mb-2 p-2 rounded bg-slate-700"
          placeholder="Monto"
          value={egreso.amount}
          onChange={(e) =>
            setEgreso({ ...egreso, amount: e.target.value })
          }
        />
        <input
          className="w-full mb-2 p-2 rounded bg-slate-700"
          placeholder="Descripción (opcional)"
          value={egreso.description}
          onChange={(e) =>
            setEgreso({ ...egreso, description: e.target.value })
          }
        />
        <button
          onClick={handleAddExpense}
          className="bg-rose-600 px-4 py-2 rounded"
        >
          Guardar egreso
        </button>
      </div>

      {/* LISTA DE MOVIMIENTOS */}
      <h2 className="text-xl font-semibold mb-3">Historial</h2>
      <div className="space-y-2">
        {movements.map((m) => (
          <div
            key={m.id}
            className="flex justify-between items-center bg-slate-800 p-3 rounded-lg"
          >
            <div>
              <p className="text-sm text-slate-400">{m.date}</p>
              <p className="font-medium">
                {m.type === "ingreso" && (
                  <span className="text-green-400">Ingreso</span>
                )}
                {m.type === "egreso" && (
                  <span className="text-rose-400">Egreso</span>
                )}
                {m.type === "meta" && (
                  <span className="text-indigo-400">Meta</span>
                )}{" "}
                - {m.description}
              </p>
            </div>
            <div
              className={
                m.type === "ingreso"
                  ? "text-green-400 font-semibold"
                  : "text-rose-400 font-semibold"
              }
            >
              {m.type === "ingreso" ? "+" : "-"}${m.amount}
            </div>
          </div>
        ))}
        {movements.length === 0 && (
          <p className="text-slate-400 text-sm">
            Aún no tienes movimientos registrados.
          </p>
        )}
      </div>
    </div>
  );
}
