import Balance from "./pages/balance";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import { useAuthStore } from "./store/auth";

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

              {/* Enlace a Balance */}
              <Link
                className="px-3 py-1.5 rounded-md border border-slate-700 hover:bg-slate-800"
                to="/balance"
              >
                Balance
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
      <main className="w-full p-0">
        <Routes>
          <Route
            path="/"
            element={<Navigate to={user ? "/app" : "/login"} replace />}
          />
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

          {/* NUEVO: ruta protegida Balance */}
          <Route
            path="/balance"
            element={user ? <Balance /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </main>
    </div>
  );
}
