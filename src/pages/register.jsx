import { useState } from "react";
import { useAuthStore } from "../store/auth";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function Register() {
  const { register } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState(null);
  const [success, setSuccess] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setSuccess(null);

    if (form.password !== form.confirm) {
      setErr("Las contraseñas no coinciden.");
      return;
    }

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      setSuccess(
        "✅ Usuario creado correctamente. Redirigiendo al inicio de sesión..."
      );
      setTimeout(() => navigate("/login"), 2000);
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
      <h2 className="text-xl font-semibold mb-2">Crear cuenta</h2>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input
          placeholder="Nombre"
          className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Correo"
          className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        {/* Campo contraseña */}
        <div className="relative">
          <input
            placeholder="Contraseña"
            type={showPass ? "text" : "password"}
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 pr-10"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <span
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-2.5 cursor-pointer text-slate-400 hover:text-slate-200"
          >
            {showPass ? <AiFillEyeInvisible /> : <AiFillEye />}
          </span>
        </div>

        {/* Confirmación */}
        <input
          placeholder="Confirmar contraseña"
          type={showPass ? "text" : "password"}
          className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700"
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
        />

        {err && <p className="text-rose-400 text-sm">{err}</p>}
        {success && <p className="text-emerald-400 text-sm">{success}</p>}

        <button className="bg-indigo-600 hover:bg-indigo-500 rounded-lg py-2 mt-2">
          Registrarme
        </button>
      </form>
    </div>
  );
}
