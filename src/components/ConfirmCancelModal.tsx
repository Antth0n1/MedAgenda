import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, X } from 'lucide-react';

interface ConfirmCancelModalProps {
  onConfirm: () => void;
  onClose: () => void;
  patientName: string;
}

export default function ConfirmCancelModal({ onConfirm, onClose, patientName }: ConfirmCancelModalProps) {
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
        className="relative w-full max-w-sm bg-white rounded-[32px] shadow-xl overflow-hidden flex flex-col"
      >
        <div className="p-6 pt-8 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Cancelar Agendamento</h2>
          <p className="text-slate-600">
            Tem certeza que deseja cancelar o agendamento de <span className="font-semibold text-slate-800">{patientName}</span>?
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Esta ação não pode ser desfeita.
          </p>
        </div>

        <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-slate-600 font-medium hover:bg-slate-200 rounded-full transition-colors"
          >
            Voltar
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full transition-colors shadow-sm"
          >
            Sim, cancelar
          </button>
        </div>
      </motion.div>
    </div>
  );
}
