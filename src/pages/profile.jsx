import { useState } from "react";
import { useAuthStore } from "../store/auth";
import { supabase } from "../supabaseClient";

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    phone: user?.phone || "",
    age: user?.age || "",
    city: user?.city || "",
    country: user?.country || "",
    birthdate: user?.birthdate || "",
  });

  if (!user) return null;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);

      const filePath = `avatar_${user.id}_${Date.now()}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error(uploadError);
        alert("No se pudo subir la imagen");
        return;
      }

      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      const { error: updateError } = await supabase
        .from("users")
        .update({ photo_url: publicUrl })
        .eq("id", user.id);

      if (updateError) {
        console.error(updateError);
        alert("No se pudo guardar la foto en tu perfil");
        return;
      }

      updateUser({ photo_url: publicUrl });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    const { phone, age, city, country, birthdate } = form;

    const { error } = await supabase
      .from("users")
      .update({
        phone: phone || null,
        age: age ? Number(age) : null,
        city: city || null,
        country: country || null,
        birthdate: birthdate || null,
      })
      .eq("id", user.id);

    if (error) {
      console.error(error);
      alert("No se pudieron guardar los datos del perfil");
      return;
    }

    updateUser({
      phone,
      age: age ? Number(age) : null,
      city,
      country,
      birthdate,
    });

    alert("Perfil actualizado correctamente");
  };

  const avatarSrc = user.photo_url || "/default-avatar.png";

  return (
    <div className="max-w-md mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Perfil</h1>

      {/* FOTO */}
      <div className="flex flex-col items-center mb-6">
        <img
          src={avatarSrc}
          alt="Foto de perfil"
          className="w-32 h-32 rounded-full object-cover border-4 border-slate-700"
        />
        <label className="mt-3 text-sm cursor-pointer bg-slate-800 px-3 py-1 rounded">
          {uploading ? "Subiendo..." : "Cambiar foto"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>

      {/* DATOS BÁSICOS */}
      <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-3">
        <div>
          <p className="text-xs text-slate-400">Nombre</p>
          <p className="text-lg font-semibold">{user.name}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Correo</p>
          <p>{user.email}</p>
        </div>

        {/* CAMPOS EDITABLES */}
        <div>
          <p className="text-xs text-slate-400 mb-1">Teléfono</p>
          <input
            className="w-full p-2 rounded bg-slate-800 border border-slate-700"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div>
          <p className="text-xs text-slate-400 mb-1">Edad</p>
          <input
            type="number"
            className="w-full p-2 rounded bg-slate-800 border border-slate-700"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
          />
        </div>

        <div>
          <p className="text-xs text-slate-400 mb-1">Fecha de nacimiento</p>
          <input
            type="date"
            className="w-full p-2 rounded bg-slate-800 border border-slate-700"
            value={form.birthdate}
            onChange={(e) =>
              setForm({ ...form, birthdate: e.target.value })
            }
          />
        </div>

        <div>
          <p className="text-xs text-slate-400 mb-1">Ciudad</p>
          <input
            className="w-full p-2 rounded bg-slate-800 border border-slate-700"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
        </div>

        <div>
          <p className="text-xs text-slate-400 mb-1">País</p>
          <input
            className="w-full p-2 rounded bg-slate-800 border border-slate-700"
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
          />
        </div>

        <button
          onClick={handleSaveProfile}
          className="mt-3 w-full bg-indigo-600 hover:bg-indigo-500 py-2 rounded-lg font-semibold"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}
