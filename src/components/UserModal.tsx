import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, User as UserIcon, Lock, Shield } from 'lucide-react';
import { RegisteredUser } from '../types';

interface UserModalProps {
  onClose: () => void;
  onSave: (user: RegisteredUser, oldName?: string) => void;
  initialData?: RegisteredUser;
}

export default function UserModal({ onClose, onSave, initialData }: UserModalProps) {
  const [username, setUsername] = useState(initialData?.name || '');
  const [password, setPassword] = useState(initialData?.password || '');
  const [role, setRole] = useState(initialData?.role || 'Recepcionista');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name: username, password, role }, initialData?.name);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-white rounded-[32px] shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-slate-800">
            {initialData ? 'Editar Usuário' : 'Novo Usuário'}
          </h2>
          <button  
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="user-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
                Nome de Usuário
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <UserIcon size={18} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 focus:bg-white transition-colors text-slate-900"
                  placeholder="Ex: joao.silva"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 focus:bg-white transition-colors text-slate-900"
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
                Cargo / Papel
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Shield size={18} />
                </div>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 focus:bg-white transition-colors text-slate-900 appearance-none"
                  required
                >
                  <option value="Recepcionista">Recepcionista</option>
                  <option value="Médico(a)">Médico(a)</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 sticky bottom-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-slate-600 font-medium hover:bg-slate-200 rounded-full transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="user-form"
            className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-full transition-colors shadow-sm"
          >
            Cadastrar
          </button>
        </div>
      </motion.div>
    </div>
  );
}
