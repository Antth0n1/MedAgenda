import React from 'react';
import { motion } from 'motion/react';
import { X, Edit2, Shield, User as UserIcon } from 'lucide-react';
import { RegisteredUser } from '../types';

interface UsersListModalProps {
  onClose: () => void;
  users: RegisteredUser[];
  onEditUser: (user: RegisteredUser) => void;
  onNewUser: () => void;
  currentUser: RegisteredUser;
}

export default function UsersListModal({ onClose, users, onEditUser, onNewUser, currentUser }: UsersListModalProps) {
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
        className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-slate-800">Gerenciar Usuários</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto w-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-slate-800">Usuários Cadastrados</h3>
            {currentUser.role === 'Administrador' && (
              <button
                onClick={onNewUser}
                className="px-4 py-2 bg-teal-50 text-teal-700 rounded-full font-medium hover:bg-teal-100 transition-colors text-sm"
              >
                + Novo Usuário
              </button>
            )}
          </div>
          
          <div className="space-y-3">
            {users.map((u) => (
              <div key={u.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center">
                    <UserIcon size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">{u.name} {u.name === currentUser.name ? '(Você)' : ''}</h4>
                    <span className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                      <Shield size={14} />
                      {u.role}
                    </span>
                  </div>
                </div>
                
                {(currentUser.role === 'Administrador' || currentUser.name === u.name) && (
                  <button
                    onClick={() => onEditUser(u)}
                    className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-colors"
                    title="Editar"
                  >
                    <Edit2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
