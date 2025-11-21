import { useEffect, useState } from "react";
import { useAuthStore } from "../store/auth";
import { useObligationsStore } from "../store/obligations";

export default function Obligations() {
  const { user } = useAuthStore();
  const { loadFor, getPending, addObligation, markAsPaid } =
    useObligationsStore();

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    amount: "",
  });

  useEffect(() => {
    if (user) {
      loadFor(user.id);
    }
  }, [user, loadFor]);

  if (!user) return null;

  const obligations = getPending(user.id);

  const handleAdd = async () => {
    await addObligation(user.id, form);
    setForm({
      title: "",
      description: "",
      dueDate: "",
      amount: "",
    });
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("¿Marcar esta obligación como pagada?");
    if (!ok) return;
    await markAsPaid(user.id, id);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Obligaciones pendientes</h1>

      {/* Formulario nueva obligación */}
      <section className="bg-slate-900 p-4 rounded-2xl border border-slate-800 mb-6">
        <h2 className="text-lg font-semibold mb-3">Agregar obligación</h2>
        <div className="grid md:grid-cols-2 gap-3 mb-3">
          <input
            className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700"
            placeholder="Concepto (ej: Servicio, Cuota..etc)"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />
          <input
            type="date"
            className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700"
            value={form.dueDate}
            onChange={(e) =>
              setForm({ ...form, dueDate: e.target.value })
            }
          />
          <input
            type="number"
            className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700"
            placeholder="Valor"
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value })
            }
          />
          <input
            className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700"
            placeholder="Descripción"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </div>
        <button
          onClick={handleAdd}
          className="bg-indigo-600 hover:bg-indigo-500 rounded-lg px-4 py-2 font-medium"
        >
          Guardar obligación
        </button>
      </section>

      {/* Lista de obligaciones pendientes */}
      <section className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <h2 className="text-lg font-semibold mb-3">Pendientes por pagar</h2>

        {obligations.length === 0 ? (
          <p className="text-slate-400 text-sm">
            No tienes obligaciones pendientes registradas.
          </p>
        ) : (
          <div className="space-y-3">
            {obligations.map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between bg-slate-800 px-3 py-2 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-semibold">{o.title}</p>
                  {o.description && (
                    <p className="text-xs text-slate-400">
                      {o.description}
                    </p>
                  )}
                  <p className="text-xs text-slate-400 mt-1">
                    Vence:{" "}
                    <span className="font-medium text-slate-200">
                      {o.dueDate}
                    </span>
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-emerald-400 font-semibold">
                    ${o.amount.toLocaleString()}
                  </p>
                  <button
                    onClick={() => handleDelete(o.id)}
                    className="mt-2 text-xs bg-rose-600 hover:bg-rose-500 px-3 py-1 rounded-lg"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
