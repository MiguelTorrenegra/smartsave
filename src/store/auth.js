import { create } from "zustand";

const USERS_KEY = "finova_users";
const SESSION_KEY = "finova_session";

function loadUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function saveSession(user) {
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else localStorage.removeItem(SESSION_KEY);
}
function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

export const useAuthStore = create((set) => ({
  user: loadSession(),
 register: ({ name, email, password }) => {
  const users = loadUsers();
  if (users[email]) throw new Error("Ya existe un usuario con este correo.");
  const id = crypto.randomUUID();
  users[email] = { id, name, email, password };
  saveUsers(users);
 
},

  login: ({ email, password }) => {
    const users = loadUsers();
    const u = users[email];
    if (!u || u.password !== password) throw new Error("Credenciales inválidas.");
    const session = { id: u.id, name: u.name, email: u.email };
    saveSession(session);
    set({ user: session });
  },
  logout: () => {
    saveSession(null);
    set({ user: null });
  },
}));
