import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User as UserIcon, Lock, ArrowRight, Stethoscope } from 'lucide-react';
import { User, RegisteredUser } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  registeredUsers: RegisteredUser[];
}

export default function Login({ onLogin, registeredUsers }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const foundUser = registeredUsers.find(
      (u) => u.name === username && u.password === password
    );

    if (foundUser) {
      onLogin({ name: foundUser.name, role: foundUser.role });
    } else {
      setError('Usuário ou senha incorretos');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center mb-4">
              <Stethoscope size={32} />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">Bem-vindo</h1>
            <p className="text-slate-500 mt-1">Faça login para continuar</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm text-center font-medium"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <UserIcon size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 focus:bg-white transition-colors text-slate-900 placeholder-slate-400"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 focus:bg-white transition-colors text-slate-900 placeholder-slate-400"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-full font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              Entrar
              <ArrowRight size={20} />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
