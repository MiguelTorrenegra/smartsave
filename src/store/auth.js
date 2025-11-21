import { create } from "zustand";
import { supabase } from "../supabaseClient";

export const useAuthStore = create((set) => ({
  user: null,

  // REGISTRO: solo crea el usuario, NO inicia sesión
  async register({ name, email, password }) {
    const id = crypto.randomUUID();

    const { error } = await supabase.from("users").insert({
      id,
      name,
      email,
      password,
      photo_url: null,
      phone: null,
      age: null,
      city: null,
      country: null,
      birthdate: null,
    });

    if (error) {
      if (error.code === "23505") {
        throw new Error("Ya existe un usuario con este correo.");
      }
      throw new Error("Error al registrar el usuario.");
    }

    // 👇 Importante: NO hacemos set({ user: ... })
    return { id, name, email };
  },

  // LOGIN
  async login({ email, password }) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .maybeSingle();

    if (error || !data) {
      throw new Error("Credenciales inválidas.");
    }

    const sessionUser = {
      id: data.id,
      name: data.name,
      email: data.email,
      photo_url: data.photo_url || null,
      phone: data.phone || "",
      age: data.age || null,
      city: data.city || "",
      country: data.country || "",
      birthdate: data.birthdate || "",
    };

    set({ user: sessionUser });
  },

  // actualizar usuario en memoria
  updateUser(partial) {
    set((state) => ({
      user: state.user ? { ...state.user, ...partial } : null,
    }));
  },

  logout() {
    set({ user: null });
  },
}));
