import Balance from "./pages/balance";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import { useAuthStore } from "./store/auth";
import Goals from "./pages/goals";
import Movements from "./pages/movements";
import { supabase } from "./supabaseClient";
import Profile from "./pages/profile";
import Obligations from "./pages/obligations";


supabase
  .from("incomes")
  .select("*")
  .then((res) => console.log("SUPABASE RESPONDE:", res));

export default function App() {
  const { user, logout } = useAuthStore();

  return (
    <div>
      {/* Barra superior */}
      <nav className="flex justify-between items-center p-4 bg-slate-900 border-b border-slate-800">
        <div className="font-semibold text-indigo-400 text-lg">SmartSave</div>

        <div className="flex gap-2">
          {!user ? (
            <>
              <Link
                className="px-3 py-1.5 rounded-md border border-slate-700 hover:bg-slate-800"
                to="/login"
              >
                Iniciar sesión
              </Link>
              <Link
                className="px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500"
                to="/register"
              >
                Crear cuenta
              </Link>
            </>
          ) : (
            <>
              <Link
                className="px-3 py-1.5 rounded-md border border-slate-700 hover:bg-slate-800"
                to="/app"
              >
                Panel
              </Link>

              <Link
                className="px-3 py-1.5 rounded-md border border-slate-700 hover:bg-slate-800"
                to="/balance"
              >
                Balance
              </Link>

              <Link
                className="px-3 py-1.5 rounded-md border border-slate-700 hover:bg-slate-800"
                to="/goals"
              >
                Metas
              </Link>

              <Link
                className="px-3 py-1.5 rounded-md border border-slate-700 hover:bg-slate-800"
                to="/movements"
              >
                Movimientos
              </Link>

              <Link
                className="px-3 py-1.5 rounded-md border border-slate-700 hover:bg-slate-800"
                to="/obligations"
              >
                Obligaciones
              </Link>

              <Link
                className="px-3 py-1.5 rounded-md border border-slate-700 hover:bg-slate-800"
                to="/profile"
              >
                Perfil
              </Link>

              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700"
              >
                Salir
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Contenido */}
      <main className="w-full p-0 text-white">
        <Routes>
          {/* Siempre arranca en login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route
            path="/login"
            element={user ? <Navigate to="/app" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/app" replace /> : <Register />}
          />

          <Route
            path="/app"
            element={user ? <Dashboard /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/balance"
            element={user ? <Balance /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/goals"
            element={user ? <Goals /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/movements"
            element={user ? <Movements /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/obligations"
            element={
              user ? <Obligations /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </main>
    </div>
  );
}
