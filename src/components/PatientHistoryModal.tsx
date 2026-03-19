import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { X, Search, Calendar, Clock, Activity, Stethoscope } from 'lucide-react';
import { Appointment } from '../types';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PatientHistoryModalProps {
  onClose: () => void;
  appointments: Appointment[];
  initialPatientName?: string;
}

export default function PatientHistoryModal({ onClose, appointments, initialPatientName = '' }: PatientHistoryModalProps) {
  const [searchTerm, setSearchTerm] = useState(initialPatientName);

  const patientHistory = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const term = searchTerm.toLowerCase();
    return appointments
      .filter(apt => apt.patientName.toLowerCase().includes(term))
      .sort((a, b) => {
        const dateTimeA = `${a.date}T${a.time}`;
        const dateTimeB = `${b.date}T${b.time}`;
        // Descending order (newest to oldest)
        return dateTimeB.localeCompare(dateTimeA);
      });
  }, [appointments, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-teal-100 text-teal-800';
      case 'completed': return 'bg-slate-200 text-slate-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Agendado';
      case 'completed': return 'Concluído';
      case 'canceled': return 'Cancelado';
      default: return status;
    }
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
        className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-slate-800">Histórico do Paciente</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors text-slate-900 shadow-sm"
                placeholder="Buscar pelo nome do paciente..."
                autoFocus
              />
            </div>
          </div>

          {searchTerm.trim() === '' ? (
            <div className="text-center py-12">
              <Search size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-900">Buscar Paciente</h3>
              <p className="text-slate-500 mt-1">Digite o nome do paciente para ver seu histórico.</p>
            </div>
          ) : patientHistory.length === 0 ? (
            <div className="text-center py-12">
              <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-900">Nenhum registro encontrado</h3>
              <p className="text-slate-500 mt-1">Não há agendamentos para "{searchTerm}".</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3 px-1">
                Resultados ({patientHistory.length})
              </h3>
              {patientHistory.map((apt, index) => (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white p-5 rounded-[24px] shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4 ${apt.status === 'canceled' ? 'opacity-60 grayscale' : ''}`}
                >
                  <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1 min-w-[120px]">
                    <div className="flex items-center text-slate-700 font-medium">
                      <Calendar size={16} className="mr-2 text-teal-600" />
                      {format(parseISO(apt.date), "dd 'de' MMM", { locale: ptBR })}
                    </div>
                    <div className="flex items-center text-slate-500 text-sm">
                      <Clock size={16} className="mr-2" />
                      {apt.time}
                    </div>
                  </div>

                  <div className="flex-1 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-slate-800 text-lg">{apt.patientName}</h3>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(apt.status)}`}>
                        {getStatusText(apt.status)}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-slate-600 mt-2">
                      {apt.type === 'consulta' ? (
                        <>
                          <Stethoscope size={16} className="mr-2 text-teal-600" />
                          <span>{apt.doctorName} • {apt.specialty}</span>
                        </>
                      ) : (
                        <>
                          <Activity size={16} className="mr-2 text-teal-600" />
                          <span>{apt.examName}</span>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
