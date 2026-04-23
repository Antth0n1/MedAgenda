import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, User, Calendar, Clock, Stethoscope, Activity } from 'lucide-react';
import { Appointment, Doctor, Exam, Patient } from '../types';

interface AppointmentModalProps {
  onClose: () => void;
  onSave: (appointment: Omit<Appointment, 'id' | 'status'>) => void;
  initialData?: Appointment;
  doctors: Doctor[];
  exams: Exam[];
  patients: Patient[];
}

export default function AppointmentModal({ onClose, onSave, initialData, doctors, exams, patients }: AppointmentModalProps) {
  const initialDoctorIndex = initialData?.doctorName 
    ? doctors.findIndex(d => d.name === initialData.doctorName)
    : 0;
    
  const initialExamIndex = initialData?.examName
    ? exams.findIndex(e => e.name === initialData.examName)
    : 0;

  const [type, setType] = useState<'consulta' | 'exame'>(initialData?.type || 'consulta');
  const [patientName, setPatientName] = useState(initialData?.patientName || '');
  const [doctorIndex, setDoctorIndex] = useState(initialDoctorIndex >= 0 ? initialDoctorIndex : 0);
  const [examIndex, setExamIndex] = useState(initialExamIndex >= 0 ? initialExamIndex : 0);
  const [date, setDate] = useState(initialData?.date || '');
  const [time, setTime] = useState(initialData?.time || '');
  const [observations, setObservations] = useState(initialData?.observations || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedDoctor = doctors[doctorIndex];
    const selectedExam = exams[examIndex];
    
    onSave({
      patientName,
      type,
      ...(type === 'consulta' ? {
        doctorName: selectedDoctor?.name || '',
        specialty: selectedDoctor?.specialty || '',
      } : {
        examName: selectedExam?.name || '',
      }),
      date,
      time,
      observations,
    });
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
        className="relative w-full max-w-lg bg-white rounded-[32px] shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-slate-800">
            {initialData ? 'Editar Agendamento' : 'Novo Agendamento'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="flex p-1 bg-slate-100 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => setType('consulta')}
              className={`flex-1 py-2 text-sm font-medium rounded-xl transition-colors ${type === 'consulta' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Consulta
            </button>
            <button
              type="button"
              onClick={() => setType('exame')}
              className={`flex-1 py-2 text-sm font-medium rounded-xl transition-colors ${type === 'exame' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Exame
            </button>
          </div>

          <form id="appointment-form" onSubmit={handleSubmit} className="space-y-5">
            {/* Patient Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
                Nome do Paciente
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  list="patients-list"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 focus:bg-white transition-colors text-slate-900"
                  placeholder="Ex: Maria da Silva"
                  required
                />
                <datalist id="patients-list">
                  {patients.map(p => (
                    <option key={p.id} value={p.name} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Conditional Selection: Doctor or Exam */}
            {type === 'consulta' ? (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
                  Médico e Especialidade
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Stethoscope size={18} />
                  </div>
                  <select
                    value={doctorIndex}
                    onChange={(e) => setDoctorIndex(Number(e.target.value))}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 focus:bg-white transition-colors text-slate-900 appearance-none"
                    required={type === 'consulta'}
                  >
                    {doctors.length === 0 && (
                      <option value="" disabled>Nenhum médico cadastrado</option>
                    )}
                    {doctors.map((doc, idx) => (
                      <option key={doc.id} value={idx}>
                        {doc.name} - {doc.specialty}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
                  Nome do Exame
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Activity size={18} />
                  </div>
                  <select
                    value={examIndex}
                    onChange={(e) => setExamIndex(Number(e.target.value))}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 focus:bg-white transition-colors text-slate-900 appearance-none"
                    required={type === 'exame'}
                  >
                    {exams.length === 0 && (
                      <option value="" disabled>Nenhum exame cadastrado</option>
                    )}
                    {exams.map((exam, idx) => (
                      <option key={exam.id} value={idx}>
                        {exam.name} - {exam.specialty}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
                  Data
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Calendar size={18} />
                  </div>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 focus:bg-white transition-colors text-slate-900"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
                  Horário
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Clock size={18} />
                  </div>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 focus:bg-white transition-colors text-slate-900"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
                Observações
              </label>
              <textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors text-slate-900 resize-none"
                placeholder="Detalhes adicionais..."
                rows={3}
              />
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
            form="appointment-form"
            className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-full transition-colors shadow-sm"
          >
            {initialData ? 'Salvar Alterações' : 'Agendar'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
