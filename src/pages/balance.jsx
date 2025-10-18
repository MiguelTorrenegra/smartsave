import { useAuthStore } from "../store/auth";
import { useIncomeStore } from "../store/incomes";

export default function Balance() {
  const { user } = useAuthStore();
  const { getFor, total } = useIncomeStore();

  const incomes = user ? getFor(user.id) : [];
  const totalValue = user ? total(user.id) : 0;

  return (
    <div className="max-w-2xl mx-auto grid gap-6">
      {/* Título */}
      <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <h2 className="text-xl font-semibold">Balance general</h2>
        <p className="text-slate-400">Resumen de tus ingresos registrados</p>
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
    </div>
  );
}
