import React from 'react';
import { motion } from 'motion/react';
import { X, Calendar, Clock, User, Stethoscope, Activity, FileText, CheckCircle, XCircle } from 'lucide-react';
import { Appointment } from '../types';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AppointmentDetailsModalProps {
  appointment: Appointment;
  onClose: () => void;
  onEdit: () => void;
  onCancel: () => void;
}

export default function AppointmentDetailsModal({ appointment, onClose, onEdit, onCancel }: AppointmentDetailsModalProps) {
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
        className="relative w-full max-w-lg bg-white rounded-[32px] shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            Detalhes do Agendamento
            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md ${appointment.status === 'canceled' ? 'bg-red-100 text-red-600' : appointment.status === 'completed' ? 'bg-teal-100 text-teal-600' : 'bg-blue-100 text-blue-600'}`}>
              {appointment.status === 'canceled' ? 'Cancelado' : appointment.status === 'completed' ? 'Concluído' : 'Agendado'}
            </span>
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
              <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center">
                <User size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium mb-0.5">Paciente</p>
                <p className="text-lg font-semibold text-slate-900">{appointment.patientName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 text-slate-500 rounded-full flex items-center justify-center">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Data</p>
                  <p className="font-medium text-slate-900">
                    {appointment.date ? format(parseISO(appointment.date), "dd 'de' MMMM, yyyy", { locale: ptBR }) : '-'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 text-slate-500 rounded-full flex items-center justify-center">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Horário</p>
                  <p className="font-medium text-slate-900">{appointment.time || '-'}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {appointment.type === 'consulta' && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                    <Stethoscope size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Médico & Especialidade</p>
                    <p className="font-medium text-slate-900">{appointment.doctorName} <span className="text-slate-500 font-normal">({appointment.specialty})</span></p>
                  </div>
                </div>
              )}
              {appointment.type === 'exame' && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                    <Activity size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Exame</p>
                    <p className="font-medium text-slate-900">{appointment.examName}</p>
                  </div>
                </div>
              )}
            </div>

            {appointment.observations && (
              <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-2xl">
                <h4 className="flex items-center gap-2 text-sm font-medium text-amber-800 mb-2">
                  <FileText size={16} />
                  Observações
                </h4>
                <p className="text-slate-700 text-sm whitespace-pre-wrap">{appointment.observations}</p>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 flex justify-between gap-3 border-t border-slate-100">
          <div className="space-x-2">
            {appointment.status !== 'canceled' && (
              <button
                onClick={onCancel}
                className="px-4 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 font-medium rounded-xl transition-colors inline-flex items-center gap-2 text-sm"
              >
                <XCircle size={16} /> Cancelar 
              </button>
            )}
          </div>
          <div className="space-x-2 flex">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-slate-600 font-medium hover:bg-slate-200 rounded-xl transition-colors text-sm"
            >
              Fechar
            </button>
            {appointment.status !== 'canceled' && (
              <button
                onClick={onEdit}
                className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl transition-colors shadow-sm text-sm"
              >
                Editar
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
