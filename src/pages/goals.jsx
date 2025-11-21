import { useState, useEffect } from "react";
import { useAuthStore } from "../store/auth";
import { useGoalStore } from "../store/goal";
import { useIncomeStore } from "../store/incomes";
import { useMovementStore } from "../store/movements";

export default function Goals() {
  const { user } = useAuthStore();
  const { getFor, addGoal, addToGoal, totalSaved, loadFor } = useGoalStore();
  const { total } = useIncomeStore();
  const { addMovement, totalExpenses } = useMovementStore();


  const [form, setForm] = useState({
    title: "",
    targetAmount: "",
    image: null,
  });

  const [openGoal, setOpenGoal] = useState(null);
  const [addAmount, setAddAmount] = useState("");

  useEffect(() => {
    if (user) {
      loadFor(user.id); // 👈 carga metas desde Supabase
    }
  }, [user, loadFor]);

  if (!user) return null;

  const goals = getFor(user.id);
  const totalIngresos = total(user.id);
  const ahorradoEnMetas = totalSaved(user.id);
  const gastos = totalExpenses(user.id);
  const saldoDisponible = totalIngresos - gastos - ahorradoEnMetas;


  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setForm({ ...form, image: url });
    }
  };

  const handleAddGoal = async () => {
    await addGoal(user.id, form);
    setForm({ title: "", targetAmount: "", image: null });
  };

  const handleAddMoney = async (goal) => {
    const amount = Number(addAmount);
    if (!amount || amount <= 0) return alert("Monto inválido");

    if (amount > saldoDisponible)
      return alert("No tienes suficiente saldo disponible.");

    await addToGoal(user.id, goal.id, amount);

    await addMovement(user.id, {
      type: "meta",
      amount,
      description: "Aporte a meta",
      date: new Date().toISOString().slice(0, 10),
    });

    setAddAmount("");
    setOpenGoal(null);
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Mis Metas</h1>

      <div className="mb-4 p-4 bg-slate-800 rounded-lg font-semibold">
        Saldo disponible:{" "}
        <span className="text-green-400">${saldoDisponible}</span>
      </div>

      {/* CREAR META */}
      <div className="mb-6 bg-slate-800 p-4 rounded-lg">
        <h2 className="text-xl mb-2 font-semibold">Crear nueva meta</h2>

        <input
          className="w-full mb-2 p-2 rounded bg-slate-700"
          placeholder="Nombre de la meta"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          className="w-full mb-2 p-2 rounded bg-slate-700"
          placeholder="Monto objetivo"
          type="number"
          value={form.targetAmount}
          onChange={(e) =>
            setForm({ ...form, targetAmount: e.target.value })
          }
        />

        <input type="file" onChange={handleImage} className="mb-2" />

        {form.image && (
          <img
            src={form.image}
            alt="Meta seleccionada"
            className="w-32 h-32 object-cover rounded mb-2"
          />
        )}

        <button
          onClick={handleAddGoal}
          className="bg-indigo-600 px-4 py-2 rounded"
        >
          Crear meta
        </button>
      </div>

      {/* METAS CREADAS */}
      <h2 className="text-xl font-semibold mb-3">Metas creadas</h2>

      <div className="grid gap-4">
        {goals.map((g) => {
          const progreso = Math.min(
            (g.savedAmount / g.targetAmount) * 100 || 0,
            100
          );

          return (
            <div key={g.id} className="bg-slate-800 p-4 rounded-lg">
              {g.image && (
                <img
                  src={g.image}
                  alt={g.title}
                  className="w-full h-40 object-cover rounded mb-2"
                />
              )}

              <h3 className="text-lg font-bold">{g.title}</h3>
              <p>Objetivo: ${g.targetAmount}</p>
              <p>Ahorrado: ${g.savedAmount}</p>

              <div className="w-full h-3 bg-slate-700 rounded mt-2">
                <div
                  className="h-3 bg-green-500 rounded"
                  style={{ width: `${progreso}%` }}
                ></div>
              </div>

              <button
                onClick={() => setOpenGoal(g.id)}
                className="bg-green-600 px-3 py-1 rounded mt-3"
              >
                Añadir dinero
              </button>

              {openGoal === g.id && (
                <div className="mt-3 bg-slate-700 p-3 rounded">
                  <input
                    type="number"
                    className="w-full p-2 rounded bg-slate-600 mb-2"
                    placeholder="Monto a añadir"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                  />

                  <button
                    onClick={() => handleAddMoney(g)}
                    className="bg-blue-500 px-3 py-1 rounded"
                  >
                    Confirmar
                  </button>

                  <button
                    onClick={() => setOpenGoal(null)}
                    className="ml-2 bg-red-500 px-3 py-1 rounded"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {goals.length === 0 && (
          <p className="text-slate-400 text-sm">
            Aún no has creado metas de ahorro.
          </p>
        )}
      </div>
    </div>
  );
}
