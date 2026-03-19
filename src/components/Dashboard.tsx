import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Calendar, Clock, Stethoscope, LogOut, MoreVertical, UserPlus, Activity, Edit2, XCircle, ClipboardList } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Appointment, User, RegisteredUser, Doctor, Exam } from '../types';
import AppointmentModal from './AppointmentModal';
import UserModal from './UserModal';
import DoctorModal from './DoctorModal';
import ExamModal from './ExamModal';
import PatientHistoryModal from './PatientHistoryModal';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onRegisterUser: (user: RegisteredUser) => void;
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientName: 'Maria Silva',
    type: 'consulta',
    doctorName: 'Dr. Carlos Mendes',
    specialty: 'Cardiologia',
    date: '2026-03-20',
    time: '09:00',
    status: 'scheduled',
  },
  {
    id: '2',
    patientName: 'João Santos',
    type: 'exame',
    examName: 'Ecocardiograma',
    date: '2026-03-20',
    time: '10:30',
    status: 'scheduled',
  },
  {
    id: '3',
    patientName: 'Pedro Alves',
    type: 'consulta',
    doctorName: 'Dr. Carlos Mendes',
    specialty: 'Cardiologia',
    date: '2026-03-21',
    time: '14:00',
    status: 'scheduled',
  },
];

const initialDoctors: Doctor[] = [
  { id: '1', name: 'Dr. Carlos Mendes', specialty: 'Cardiologia' },
  { id: '2', name: 'Dra. Ana Paula', specialty: 'Dermatologia' },
  { id: '3', name: 'Dr. Roberto Santos', specialty: 'Ortopedia' },
  { id: '4', name: 'Dra. Juliana Costa', specialty: 'Pediatria' },
];

const initialExams: Exam[] = [
  { id: '1', name: 'Ecocardiograma', specialty: 'Cardiologia' },
  { id: '2', name: 'Raio-X', specialty: 'Ortopedia' },
  { id: '3', name: 'Hemograma Completo', specialty: 'Clínica Geral' },
  { id: '4', name: 'Ultrassonografia', specialty: 'Geral' },
];

export default function Dashboard({ user, onLogout, onRegisterUser }: DashboardProps) {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [exams, setExams] = useState<Exam[]>(initialExams);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedPatientForHistory, setSelectedPatientForHistory] = useState<string>('');
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'consulta' | 'exame'>('consulta');

  const canViewHistory = ['Médico(a)', 'Recepcionista', 'Administrador'].includes(user.role);

  const filteredAppointments = appointments.filter(apt => apt.type === activeTab);

  const handleSaveAppointment = (formData: Omit<Appointment, 'id' | 'status'>) => {
    if (editingAppointment) {
      setAppointments(prev => prev.map(apt => apt.id === editingAppointment.id ? { ...apt, ...formData } : apt));
    } else {
      const newAppointment: Appointment = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        status: 'scheduled',
      };
      setAppointments([...appointments, newAppointment].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
      }));
    }
    setIsModalOpen(false);
    setEditingAppointment(null);
  };

  const handleEdit = (apt: Appointment) => {
    setEditingAppointment(apt);
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleCancel = (id: string) => {
    setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, status: 'canceled' } : apt));
    setActiveMenuId(null);
  };

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
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* Header */}
      <header className="bg-teal-600 text-white pt-12 pb-6 px-6 rounded-b-[32px] shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-semibold mb-1">Olá, {user.name}</h1>
            <p className="text-teal-100 opacity-90">{user.role}</p>
          </div>
          <div className="flex gap-3">
            {canViewHistory && (
              <button 
                onClick={() => {
                  setSelectedPatientForHistory('');
                  setIsHistoryModalOpen(true);
                }}
                className="p-3 bg-teal-700/50 hover:bg-teal-700 rounded-full transition-colors"
                title="Histórico de Pacientes"
              >
                <ClipboardList size={20} />
              </button>
            )}
            <button 
              onClick={() => setIsExamModalOpen(true)}
              className="p-3 bg-teal-700/50 hover:bg-teal-700 rounded-full transition-colors"
              title="Cadastrar Exame"
            >
              <Activity size={20} />
            </button>
            <button 
              onClick={() => setIsDoctorModalOpen(true)}
              className="p-3 bg-teal-700/50 hover:bg-teal-700 rounded-full transition-colors"
              title="Cadastrar Médico"
            >
              <Stethoscope size={20} />
            </button>
            <button 
              onClick={() => setIsUserModalOpen(true)}
              className="p-3 bg-teal-700/50 hover:bg-teal-700 rounded-full transition-colors"
              title="Cadastrar Novo Usuário"
            >
              <UserPlus size={20} />
            </button>
            <button 
              onClick={onLogout}
              className="p-3 bg-teal-700/50 hover:bg-teal-700 rounded-full transition-colors"
              title="Sair"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
        {/* Tabs */}
        <div className="flex p-1 bg-slate-200/50 rounded-2xl mb-6 max-w-xs">
          <button
            onClick={() => setActiveTab('consulta')}
            className={`flex-1 py-2 text-sm font-medium rounded-xl transition-colors ${activeTab === 'consulta' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Consultas
          </button>
          <button
            onClick={() => setActiveTab('exame')}
            className={`flex-1 py-2 text-sm font-medium rounded-xl transition-colors ${activeTab === 'exame' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Exames
          </button>
        </div>

        <div className="flex justify-between items-end mb-6">
          <h2 className="text-xl font-medium text-slate-800">
            {activeTab === 'consulta' ? 'Próximas Consultas' : 'Próximos Exames'}
          </h2>
          <span className="text-sm font-medium text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
            {filteredAppointments.length} agendamentos
          </span>
        </div>

        <div className="space-y-4">
          {filteredAppointments.map((apt, index) => (
            <motion.div
              key={apt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white p-5 rounded-[24px] shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-all cursor-pointer group ${apt.status === 'canceled' ? 'opacity-60 grayscale' : ''}`}
            >
              {/* Date & Time Badge */}
              <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1 min-w-[120px]">
                <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                  <Calendar size={16} className="text-teal-600" />
                  <span>{format(parseISO(apt.date), "dd MMM", { locale: ptBR })}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                  <Clock size={16} />
                  <span>{apt.time}</span>
                </div>
              </div>

              {/* Patient & Doctor/Exam Info */}
              <div className="flex-1">
                <h3 className="text-lg font-medium text-slate-900 flex items-center gap-2">
                  {apt.patientName}
                  <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">
                    {apt.type === 'consulta' ? 'Consulta' : 'Exame'}
                  </span>
                  {apt.status === 'canceled' && (
                    <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md bg-red-100 text-red-600">
                      Cancelado
                    </span>
                  )}
                </h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                  {apt.type === 'consulta' ? (
                    <>
                      <span className="flex items-center gap-1.5">
                        <Stethoscope size={14} />
                        {apt.doctorName}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                        {apt.specialty}
                      </span>
                    </>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Activity size={14} />
                      {apt.examName}
                    </span>
                  )}
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                  {getStatusText(apt.status)}
                </span>
                <div className="relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuId(activeMenuId === apt.id ? null : apt.id);
                    }}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <MoreVertical size={20} />
                  </button>
                  
                  {activeMenuId === apt.id && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(null);
                        }}
                      />
                      <div className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-xl border border-slate-100 z-20 py-2 overflow-hidden">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(apt);
                          }}
                          disabled={apt.status === 'canceled'}
                          className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Edit2 size={16} />
                          Editar
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancel(apt.id);
                          }}
                          disabled={apt.status === 'canceled'}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <XCircle size={16} />
                          Cancelar
                        </button>
                        {canViewHistory && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPatientForHistory(apt.patientName);
                              setIsHistoryModalOpen(true);
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-teal-600 hover:bg-teal-50 flex items-center gap-2 border-t border-slate-100"
                          >
                            <ClipboardList size={16} />
                            Ver Histórico
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          
          {filteredAppointments.length === 0 && (
            <div className="text-center py-12 bg-white rounded-[24px] border border-slate-100 border-dashed">
              <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-900">
                Nenhuma {activeTab === 'consulta' ? 'consulta' : 'exame'}
              </h3>
              <p className="text-slate-500 mt-1">
                Não há agendamentos para os próximos dias.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* FAB (Floating Action Button) */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setEditingAppointment(null);
          setIsModalOpen(true);
        }}
        className="fixed bottom-8 right-8 w-16 h-16 bg-teal-600 text-white rounded-[20px] shadow-lg flex items-center justify-center hover:bg-teal-700 transition-colors z-10"
        title="Novo Agendamento"
      >
        <Plus size={32} />
      </motion.button>

      {/* Modals */}
      {isModalOpen && (
        <AppointmentModal 
          initialData={editingAppointment || undefined}
          doctors={doctors}
          exams={exams}
          onClose={() => {
            setIsModalOpen(false);
            setEditingAppointment(null);
          }} 
          onSave={handleSaveAppointment} 
        />
      )}

      {isUserModalOpen && (
        <UserModal
          onClose={() => setIsUserModalOpen(false)}
          onSave={(newUser) => {
            onRegisterUser(newUser);
            setIsUserModalOpen(false);
          }}
        />
      )}

      {isDoctorModalOpen && (
        <DoctorModal
          onClose={() => setIsDoctorModalOpen(false)}
          onSave={(newDoctor) => {
            setDoctors([...doctors, { ...newDoctor, id: Math.random().toString(36).substr(2, 9) }]);
            setIsDoctorModalOpen(false);
          }}
        />
      )}

      {isExamModalOpen && (
        <ExamModal
          onClose={() => setIsExamModalOpen(false)}
          onSave={(newExam) => {
            setExams([...exams, { ...newExam, id: Math.random().toString(36).substr(2, 9) }]);
            setIsExamModalOpen(false);
          }}
        />
      )}

      {isHistoryModalOpen && canViewHistory && (
        <PatientHistoryModal
          onClose={() => setIsHistoryModalOpen(false)}
          appointments={appointments}
          initialPatientName={selectedPatientForHistory}
        />
      )}
    </div>
  );
}
