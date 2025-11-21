import { useAuthStore } from "../store/auth";
import { useIncomeStore } from "../store/incomes";
import { useGoalStore } from "../store/goal";
import { useMovementStore } from "../store/movements";

export default function Dashboard() {
  const { user } = useAuthStore();
  const { total } = useIncomeStore();
  const { getFor: getGoals, totalSaved } = useGoalStore();
  const { getFor: getMovements, totalExpenses } = useMovementStore();

  if (!user) return null;

  const incomesTotal = total(user.id);
  const goals = getGoals(user.id);
  const movements = getMovements(user.id);
  const expensesTotal = totalExpenses(user.id);
  const savedInGoals = totalSaved(user.id);

  const saldoDisponible = incomesTotal - expensesTotal - savedInGoals;

  // ---- ALERTAS ----
  const alerts = [];

  // Saldo bajo
  if (saldoDisponible < 0) {
    alerts.push("Tu saldo disponible es negativo. Revisa tus gastos y aportes a metas.");
  } else if (incomesTotal > 0 && saldoDisponible < incomesTotal * 0.1) {
    alerts.push("Tu saldo disponible está por debajo del 10% de tus ingresos totales.");
  }

  // Progreso de metas
  goals.forEach((g) => {
    if (!g.targetAmount || g.targetAmount <= 0) return;
    const progress = g.savedAmount / g.targetAmount;

    if (progress >= 1) {
      alerts.push(`Meta "${g.title}" completada 🎉.`);
    } else if (progress >= 0.75) {
      alerts.push(`Meta "${g.title}" ha superado el 75% de avance.`);
    } else if (progress >= 0.5) {
      alerts.push(`Meta "${g.title}" ha superado el 50% de avance.`);
    }
  });

  // Gastos inusuales
  const highExpenseThreshold =
    incomesTotal > 0 ? incomesTotal * 0.3 : 500000; // 30% de ingresos o mínimo 500k

  movements
    .filter((m) => m.type === "egreso" && m.amount >= highExpenseThreshold)
    .forEach((m) => {
      alerts.push(
        `Gasto inusual: -$${m.amount} en "${m.description}" (${m.date}).`
      );
    });

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Panel general</h1>

      {/* Indicadores rápidos */}
      <div className="grid md:grid-cols-4 gap-3 mb-6">
        <div className="bg-slate-800 p-3 rounded-lg">
          <p className="text-sm text-slate-400">Ingresos</p>
          <p className="text-lg font-semibold text-green-400">
            ${incomesTotal}
          </p>
        </div>
        <div className="bg-slate-800 p-3 rounded-lg">
          <p className="text-sm text-slate-400">Egresos</p>
          <p className="text-lg font-semibold text-rose-400">
            ${expensesTotal}
          </p>
        </div>
        <div className="bg-slate-800 p-3 rounded-lg">
          <p className="text-sm text-slate-400">Ahorrado en metas</p>
          <p className="text-lg font-semibold text-indigo-400">
            ${savedInGoals}
          </p>
        </div>
        <div className="bg-slate-800 p-3 rounded-lg">
          <p className="text-sm text-slate-400">Saldo disponible</p>
          <p className="text-lg font-semibold text-emerald-400">
            ${saldoDisponible}
          </p>
        </div>
      </div>

      {/* Alertas */}
      <section className="bg-slate-800 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Alertas</h2>
        {alerts.length === 0 ? (
          <p className="text-slate-400 text-sm">
            No hay alertas por ahora. Tu situación financiera es estable. 🙌
          </p>
        ) : (
          <ul className="space-y-2">
            {alerts.map((a, idx) => (
              <li
                key={idx}
                className="bg-slate-700 px-3 py-2 rounded text-sm border border-slate-600"
              >
                {a}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
