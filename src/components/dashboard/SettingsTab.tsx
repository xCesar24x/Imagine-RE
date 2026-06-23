"use client";

import { useState, type FormEvent } from "react";
import { Shield, Plus, Edit2, Trash2 } from "lucide-react";

interface Collaborator {
  id: string;
  name: string;
  username: string;
  password: string;
  role: string;
}

interface SettingsTabProps {
  collaborators: Collaborator[];
  currentUser: Collaborator | null;
  onUpdateCollaborators: (cols: Collaborator[]) => void;
  onUpdateCurrentUser: (user: Collaborator) => void;
  lang: "en" | "es";
}

export default function SettingsTab({
  collaborators,
  currentUser,
  onUpdateCollaborators,
  onUpdateCurrentUser,
  lang
}: SettingsTabProps) {
  const [editingColId, setEditingColId] = useState<string | null>(null);
  const [colError, setColError] = useState("");
  const [colForm, setColForm] = useState({
    name: "",
    username: "",
    password: "",
    role: "Colaborador"
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  const handleSaveCollaborator = (e: FormEvent) => {
    e.preventDefault();
    setColError("");

    if (!colForm.name || !colForm.username || !colForm.password) {
      setColError(lang === "es" ? "Todos los campos son obligatorios." : "All fields are required.");
      return;
    }

    const duplicate = collaborators.find(c => c.username === colForm.username && c.id !== editingColId);
    if (duplicate) {
      setColError(lang === "es" ? "El nombre de usuario ya está registrado." : "Username already exists.");
      return;
    }

    let updatedList: Collaborator[] = [];
    if (editingColId) {
      updatedList = collaborators.map(c => {
        if (c.id === editingColId) {
          return {
            ...c,
            name: colForm.name,
            username: colForm.username,
            password: colForm.password,
            role: colForm.role
          };
        }
        return c;
      });
      if (currentUser && currentUser.id === editingColId) {
        const self = updatedList.find(c => c.id === editingColId);
        if (self) {
          onUpdateCurrentUser(self);
        }
      }
    } else {
      const newCol: Collaborator = {
        id: `col-${Date.now()}`,
        name: colForm.name,
        username: colForm.username,
        password: colForm.password,
        role: colForm.role
      };
      updatedList = [...collaborators, newCol];
    }

    onUpdateCollaborators(updatedList);
    setColForm({ name: "", username: "", password: "", role: "Colaborador" });
    setEditingColId(null);
  };

  const handleEditCollaboratorClick = (c: Collaborator) => {
    setEditingColId(c.id);
    setColForm({
      name: c.name,
      username: c.username,
      password: c.password,
      role: c.role
    });
  };

  const handleDeleteCollaborator = (id: string) => {
    setColError("");

    if (currentUser && currentUser.id === id) {
      setColError(lang === "es" ? "No puedes eliminar tu propio usuario activo." : "You cannot delete your own active user account.");
      return;
    }

    const colToDelete = collaborators.find(c => c.id === id);
    if (colToDelete?.role === "Administrador") {
      const admins = collaborators.filter(c => c.role === "Administrador");
      if (admins.length <= 1) {
        setColError(lang === "es" ? "Debe haber al menos un Administrador en el sistema." : "There must be at least one Administrator left in the system.");
        return;
      }
    }

    const updatedList = collaborators.filter(c => c.id !== id);
    onUpdateCollaborators(updatedList);
  };

  const handleChangePassword = (e: FormEvent) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    if (!currentUser) return;

    if (passwordForm.oldPassword !== currentUser.password) {
      setPwError(lang === "es" ? "La contraseña actual es incorrecta." : "Current password is incorrect.");
      return;
    }

    if (passwordForm.newPassword.length < 4) {
      setPwError(lang === "es" ? "La nueva contraseña debe tener al menos 4 caracteres." : "New password must be at least 4 characters.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPwError(lang === "es" ? "Las contraseñas nuevas no coinciden." : "New passwords do not match.");
      return;
    }

    const updatedList = collaborators.map(c => {
      if (c.id === currentUser.id) {
        return { ...c, password: passwordForm.newPassword };
      }
      return c;
    });

    onUpdateCollaborators(updatedList);
    onUpdateCurrentUser({ ...currentUser, password: passwordForm.newPassword });
    
    setPwSuccess(lang === "es" ? "Contraseña cambiada exitosamente." : "Password changed successfully.");
    setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  const isUserAdmin = currentUser?.role === "Administrador";

  return (
    <div className={`grid gap-8 ${isUserAdmin ? "lg:grid-cols-[0.9fr_1.1fr]" : "grid-cols-1 max-w-xl mx-auto"}`}>
      {/* Col 1: Change Password Form */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-md flex flex-col justify-between h-fit">
        <form onSubmit={handleChangePassword} className="space-y-4">
          <h3 className="font-serif text-lg text-pearl mb-6 border-b border-white/10 pb-3 flex items-center gap-2">
            <Shield size={18} className="text-[#d4af37]" />
            {lang === "es" ? "Mi Perfil & Contraseña" : "My Profile & Password"}
          </h3>
          
          {pwError && (
            <div className="bg-rose-950/40 border border-rose-500/30 text-rose-300 px-4 py-2 rounded-xl text-xs font-sans text-center">
              {pwError}
            </div>
          )}
          {pwSuccess && (
            <div className="bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-xl text-xs font-sans text-center">
              {pwSuccess}
            </div>
          )}

          <div>
            <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">{lang === "es" ? "Nombre" : "Name"}</label>
            <input 
              type="text" 
              disabled 
              value={currentUser?.name || ""}
              className="w-full bg-[#01140f]/60 border border-white/5 text-gray-400 text-xs px-3.5 py-2.5 rounded-xl cursor-not-allowed outline-none font-sans" 
            />
          </div>

          <div>
            <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">{lang === "es" ? "Usuario" : "Username"}</label>
            <input 
              type="text" 
              disabled 
              value={currentUser?.username || ""}
              className="w-full bg-[#01140f]/60 border border-white/5 text-gray-400 text-xs px-3.5 py-2.5 rounded-xl cursor-not-allowed outline-none font-sans" 
            />
          </div>

          <div>
            <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">{lang === "es" ? "Contraseña Actual" : "Current Password"}</label>
            <input 
              type="password" 
              required
              value={passwordForm.oldPassword}
              onChange={e => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
              className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37] font-sans" 
            />
          </div>

          <div>
            <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">{lang === "es" ? "Nueva Contraseña" : "New Password"}</label>
            <input 
              type="password" 
              required
              value={passwordForm.newPassword}
              onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37] font-sans" 
            />
          </div>

          <div>
            <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">{lang === "es" ? "Confirmar Nueva Contraseña" : "Confirm New Password"}</label>
            <input 
              type="password" 
              required
              value={passwordForm.confirmPassword}
              onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37] font-sans" 
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#d4af37] text-[#02140f] hover:bg-white text-xs py-3 rounded-xl uppercase tracking-widest font-bold cursor-pointer text-center transition duration-200"
          >
            {lang === "es" ? "Actualizar Contraseña" : "Update Password"}
          </button>
        </form>
      </div>

      {/* Col 2: Collaborators List & Creation Form (Only for Administrator role) */}
      {isUserAdmin && (
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-md">
            <h3 className="font-serif text-lg text-pearl mb-6 border-b border-white/10 pb-3 flex items-center gap-2">
              <Plus size={18} className="text-[#d4af37]" />
              {editingColId ? (lang === "es" ? "Editar Colaborador" : "Edit Collaborator") : (lang === "es" ? "Agregar Colaborador" : "Add Collaborator")}
            </h3>

            {colError && (
              <div className="bg-rose-950/40 border border-rose-500/30 text-rose-300 px-4 py-2 rounded-xl text-xs font-sans text-center mb-4">
                {colError}
              </div>
            )}

            <form onSubmit={handleSaveCollaborator} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">{lang === "es" ? "Nombre Completo" : "Full Name"}</label>
                  <input 
                    type="text" 
                    required
                    value={colForm.name}
                    onChange={e => setColForm({ ...colForm, name: e.target.value })}
                    placeholder="e.g. Maria Delgado"
                    className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37] font-sans" 
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">{lang === "es" ? "Usuario de Ingreso" : "Login Username"}</label>
                  <input 
                    type="text" 
                    required
                    value={colForm.username}
                    onChange={e => setColForm({ ...colForm, username: e.target.value.toLowerCase().replace(/\s+/g, "") })}
                    placeholder="e.g. mariad"
                    className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37] font-sans" 
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">{lang === "es" ? "Contraseña" : "Password"}</label>
                  <input 
                    type="text" 
                    required
                    value={colForm.password}
                    onChange={e => setColForm({ ...colForm, password: e.target.value })}
                    placeholder="e.g. maria123"
                    className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37] font-sans" 
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">{lang === "es" ? "Rol de Acceso" : "Access Role"}</label>
                  <select 
                    value={colForm.role}
                    onChange={e => setColForm({ ...colForm, role: e.target.value })}
                    className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37] font-sans" 
                  >
                    <option value="Colaborador">{lang === "es" ? "Colaborador" : "Collaborator"}</option>
                    <option value="Administrador">{lang === "es" ? "Administrador" : "Administrator"}</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                {editingColId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingColId(null);
                      setColForm({ name: "", username: "", password: "", role: "Colaborador" });
                      setColError("");
                    }}
                    className="flex-1 border border-white/10 hover:border-rose-400 text-pearl text-xs py-3 rounded-xl uppercase tracking-widest font-semibold cursor-pointer text-center transition"
                  >
                    {lang === "es" ? "Cancelar" : "Cancel"}
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 bg-[#d4af37] text-[#02140f] hover:bg-white text-xs py-3 rounded-xl uppercase tracking-widest font-bold cursor-pointer text-center transition"
                >
                  {editingColId ? (lang === "es" ? "Guardar Cambios" : "Save Changes") : (lang === "es" ? "Crear Colaborador" : "Create Collaborator")}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-md">
            <h3 className="font-serif text-lg text-pearl mb-6 border-b border-white/10 pb-3">
              {lang === "es" ? "Colaboradores Activos" : "Active Collaborators"} ({collaborators.length})
            </h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {collaborators.map(c => (
                <div key={c.id} className="flex gap-4 p-4 border border-white/5 bg-[#011a14] rounded-xl items-center justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-xs text-pearl font-semibold">{c.name}</span>
                      <span className="px-2 py-0.5 rounded-full text-[8px] uppercase font-sans border border-white/15 bg-white/5 font-semibold text-[#d4af37]">{c.role}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 font-mono">{lang === "es" ? "Usuario:" : "User:"} <span className="text-white">{c.username}</span> | {lang === "es" ? "Contraseña:" : "Password:"} <span className="text-white font-sans">{c.password}</span></p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={() => handleEditCollaboratorClick(c)}
                      className="p-2 rounded-lg border border-white/10 hover:border-[#d4af37] text-gray-400 hover:text-[#d4af37] transition cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleDeleteCollaborator(c.id)}
                      disabled={currentUser?.id === c.id}
                      className="p-2 rounded-lg border border-white/10 hover:border-rose-500 hover:bg-rose-500/10 text-gray-400 hover:text-rose-500 transition cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
