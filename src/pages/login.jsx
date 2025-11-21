import { useState } from "react";
import { useAuthStore } from "../store/auth";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(form);
      navigate("/app");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="w-screen min-h-[calc(100vh-64px)] flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/fondo.jpg')", 
      }}
    >
      <div className="bg-slate-900/80 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md border border-slate-700">
        <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-400">
          Bienvenido a SmartSave
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-3">
          <input
            type="email"
            placeholder="Correo electrónico"
            className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {error && <p className="text-rose-400 text-sm">{error}</p>}
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 rounded-lg py-2 font-medium"
          >
            Iniciar sesión
          </button>
        </form>
        <p className="text-slate-400 text-sm text-center mt-4">
          ¿No tienes cuenta?{" "}
          <Link className="text-indigo-400 hover:underline" to="/register">
            Crear cuenta
          </Link>
        </p>
      </div>
    </div>
  );
}
