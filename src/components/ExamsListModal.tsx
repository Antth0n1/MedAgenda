import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Edit2, Activity, Trash2 } from 'lucide-react';
import { Exam } from '../types';

interface ExamsListModalProps {
  onClose: () => void;
  exams: Exam[];
  onEditExam: (exam: Exam) => void;
  onDeleteExam: (id: string) => void;
  onNewExam: () => void;
}

export default function ExamsListModal({ onClose, exams, onEditExam, onDeleteExam, onNewExam }: ExamsListModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredExams = exams.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        className="relative w-full max-w-3xl bg-white rounded-[32px] shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-slate-800">Gerenciar Exames</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto w-full">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <input
              type="text"
              placeholder="Buscar por nome ou tipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:max-w-md px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              onClick={onNewExam}
              className="w-full sm:w-auto px-4 py-2 bg-teal-50 text-teal-700 rounded-xl font-medium hover:bg-teal-100 transition-colors text-sm whitespace-nowrap"
            >
              + Novo Exame
            </button>
          </div>
          
          <div className="space-y-3">
            {filteredExams.map((e) => (
              <div key={e.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shrink-0">
                    <Activity size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">{e.name}</h4>
                    <span className="text-sm text-slate-500 mt-0.5 inline-block">
                      {e.specialty}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={() => onEditExam(e)}
                    className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-colors"
                    title="Editar"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Tem certeza que deseja excluir ${e.name}?`)) {
                        onDeleteExam(e.id);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            
            {filteredExams.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                Nenhum exame encontrado.
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
