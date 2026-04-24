import { useState } from 'react';
import { motion } from 'motion/react';
import UsersListModal from './UsersListModal';
import { Plus, Calendar, Clock, Stethoscope, LogOut, MoreVertical, UserPlus, Activity, Edit2, XCircle, ClipboardList, User, Search, Filter, Users } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Appointment, User as AppUser, RegisteredUser, Doctor, Exam, Patient } from '../types';
import AppointmentModal from './AppointmentModal';
import UserModal from './UserModal';
import DoctorModal from './DoctorModal';
import ExamModal from './ExamModal';
import PatientHistoryModal from './PatientHistoryModal';
import PatientModal from './PatientModal';
import PatientsListModal from './PatientsListModal';
import DoctorsListModal from './DoctorsListModal';
import ExamsListModal from './ExamsListModal';
import ConfirmCancelModal from './ConfirmCancelModal';
import AppointmentDetailsModal from './AppointmentDetailsModal';

interface DashboardProps {
  user: AppUser;
  registeredUsers: RegisteredUser[];
  onLogout: () => void;
  onRegisterUser: (user: RegisteredUser) => void;
  onUpdateUser: (oldName: string, updated: RegisteredUser) => void;
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

const initialPatients: Patient[] = [
  { id: '1', name: 'Maria Silva', cpf: '111.111.111-11', address: 'Rua das Flores, 123', birthDate: '1980-05-15' },
  { id: '2', name: 'João Santos', cpf: '222.222.222-22', address: 'Av. Brasil, 456', birthDate: '1992-10-20' },
  { id: '3', name: 'Pedro Alves', cpf: '333.333.333-33', address: 'Rua do Sol, 789', birthDate: '1975-03-08' },
];

export default function Dashboard({ user, registeredUsers, onLogout, onRegisterUser, onUpdateUser }: DashboardProps) {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [exams, setExams] = useState<Exam[]>(initialExams);
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUsersListModalOpen, setIsUsersListModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<RegisteredUser | null>(null);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [isDoctorsListModalOpen, setIsDoctorsListModalOpen] = useState(false);
  const [doctorToEdit, setDoctorToEdit] = useState<Doctor | null>(null);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isExamsListModalOpen, setIsExamsListModalOpen] = useState(false);
  const [examToEdit, setExamToEdit] = useState<Exam | null>(null);
  const [isPatientsListModalOpen, setIsPatientsListModalOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null);
  const [appointmentDetails, setAppointmentDetails] = useState<Appointment | null>(null);
  const [selectedPatientForHistory, setSelectedPatientForHistory] = useState<string>('');
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'consulta' | 'exame'>('consulta');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilter, setSearchFilter] = useState<'all' | 'patient' | 'doctor' | 'specialty' | 'date' | 'time'>('all');

  const canViewHistory = ['Médico(a)', 'Recepcionista', 'Administrador'].includes(user.role);

  const filteredAppointments = appointments.filter(apt => {
    if (apt.type !== activeTab) return false;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      
      let matchDate = false;
      try {
        matchDate = apt.date.includes(term) || format(parseISO(apt.date), "dd/MM/yyyy").includes(term) || format(parseISO(apt.date), "dd MMM", { locale: ptBR }).toLowerCase().includes(term);
      } catch (e) {
        // ignore date parsing errors
      }
      
      if (searchFilter === 'patient') return apt.patientName.toLowerCase().includes(term);
      if (searchFilter === 'doctor') return (apt.doctorName || '').toLowerCase().includes(term) || (apt.examName || '').toLowerCase().includes(term);
      if (searchFilter === 'specialty') return (apt.specialty || '').toLowerCase().includes(term);
      if (searchFilter === 'date') return matchDate;
      if (searchFilter === 'time') return apt.time.includes(term);

      const matchName = apt.patientName.toLowerCase().includes(term);
      const matchDoctor = apt.doctorName?.toLowerCase().includes(term);
      const matchExam = apt.examName?.toLowerCase().includes(term);
      const matchSpecialty = apt.specialty?.toLowerCase().includes(term);
      const matchTime = apt.time.includes(term);

      return matchName || matchDoctor || matchExam || matchSpecialty || matchDate || matchTime;
    }

    return true;
  });

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
          <div 
            className="cursor-pointer hover:bg-teal-700/50 p-2 -m-2 rounded-xl transition-colors"
            onClick={() => {
              setUserToEdit(registeredUsers.find(u => u.name === user.name) || null);
              setIsUserModalOpen(true);
            }}
            title="Editar meu perfil"
          >
            <h1 className="text-3xl font-semibold mb-1">Olá, {user.name} <Edit2 size={16} className="inline-block opacity-50 ml-1 mb-1" /></h1>
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
            {canViewHistory && (
              <button 
                onClick={() => setIsPatientsListModalOpen(true)}
                className="p-3 bg-teal-700/50 hover:bg-teal-700 rounded-full transition-colors"
                title="Gestão de Pacientes"
              >
                <User size={20} />
              </button>
            )}
            <button 
              onClick={() => setIsExamsListModalOpen(true)}
              className="p-3 bg-teal-700/50 hover:bg-teal-700 rounded-full transition-colors"
              title="Gestão de Exames"
            >
              <Activity size={20} />
            </button>
            <button 
              onClick={() => setIsDoctorsListModalOpen(true)}
              className="p-3 bg-teal-700/50 hover:bg-teal-700 rounded-full transition-colors"
              title="Gestão de Médicos"
            >
              <Stethoscope size={20} />
            </button>
            <button 
              onClick={() => setIsUsersListModalOpen(true)}
              className="p-3 bg-teal-700/50 hover:bg-teal-700 rounded-full transition-colors"
              title="Gestão de Usuários"
            >
              <Users size={20} />
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
        {/* Tabs & Search */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
          <div className="flex p-1 bg-slate-200/50 rounded-2xl w-full sm:max-w-xs">
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
          
          <div className="flex gap-2 w-full sm:max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Filter size={18} />
              </div>
              <select
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value as any)}
                className="pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors text-slate-600 shadow-sm text-sm appearance-none cursor-pointer"
              >
                <option value="all">Todos</option>
                <option value="patient">Paciente</option>
                <option value="doctor">Médico/Exame</option>
                <option value="specialty">Especialidade</option>
                <option value="date">Data</option>
                <option value="time">Horário</option>
              </select>
            </div>
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors text-slate-900 shadow-sm text-sm"
              />
            </div>
          </div>
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
              onClick={() => setAppointmentDetails(apt)}
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
                            setAppointmentToCancel(apt);
                            setActiveMenuId(null);
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
          patients={patients}
          onClose={() => {
            setIsModalOpen(false);
            setEditingAppointment(null);
          }} 
          onSave={handleSaveAppointment} 
        />
      )}

      {isUserModalOpen && (
        <UserModal
          initialData={userToEdit || undefined}
          onClose={() => {
            setIsUserModalOpen(false);
            setUserToEdit(null);
          }}
          onSave={(newUser, oldName) => {
            if (oldName) {
              onUpdateUser(oldName, newUser);
            } else {
              onRegisterUser(newUser);
            }
            setIsUserModalOpen(false);
            setUserToEdit(null);
          }}
        />
      )}

      {isUsersListModalOpen && (
        <UsersListModal
          onClose={() => setIsUsersListModalOpen(false)}
          users={registeredUsers}
          currentUser={registeredUsers.find(u => u.name === user.name)!}
          onEditUser={(u) => {
            setUserToEdit(u);
            setIsUserModalOpen(true);
          }}
          onNewUser={() => {
            setUserToEdit(null);
            setIsUserModalOpen(true);
          }}
        />
      )}

      {isDoctorsListModalOpen && (
        <DoctorsListModal
          onClose={() => setIsDoctorsListModalOpen(false)}
          doctors={doctors}
          onEditDoctor={(d) => {
            setDoctorToEdit(d);
            setIsDoctorModalOpen(true);
          }}
          onDeleteDoctor={(id) => {
            setDoctors(doctors.filter(d => d.id !== id));
          }}
          onNewDoctor={() => {
            setDoctorToEdit(null);
            setIsDoctorModalOpen(true);
          }}
        />
      )}

      {isDoctorModalOpen && (
        <DoctorModal
          initialData={doctorToEdit || undefined}
          onClose={() => {
            setIsDoctorModalOpen(false);
            setDoctorToEdit(null);
          }}
          onSave={(newDoctor, id) => {
            if (id) {
              setDoctors(doctors.map(d => d.id === id ? { ...newDoctor, id } : d));
            } else {
              setDoctors([...doctors, { ...newDoctor, id: Math.random().toString(36).substr(2, 9) }]);
            }
            setIsDoctorModalOpen(false);
            setDoctorToEdit(null);
          }}
        />
      )}

      {isExamsListModalOpen && (
        <ExamsListModal
          onClose={() => setIsExamsListModalOpen(false)}
          exams={exams}
          onEditExam={(e) => {
            setExamToEdit(e);
            setIsExamModalOpen(true);
          }}
          onDeleteExam={(id) => {
            setExams(exams.filter(e => e.id !== id));
          }}
          onNewExam={() => {
            setExamToEdit(null);
            setIsExamModalOpen(true);
          }}
        />
      )}

      {isExamModalOpen && (
        <ExamModal
          initialData={examToEdit || undefined}
          onClose={() => {
            setIsExamModalOpen(false);
            setExamToEdit(null);
          }}
          onSave={(newExam, id) => {
            if (id) {
              setExams(exams.map(e => e.id === id ? { ...newExam, id } : e));
            } else {
              setExams([...exams, { ...newExam, id: Math.random().toString(36).substr(2, 9) }]);
            }
            setIsExamModalOpen(false);
            setExamToEdit(null);
          }}
        />
      )}

      {isPatientsListModalOpen && (
        <PatientsListModal
          onClose={() => setIsPatientsListModalOpen(false)}
          patients={patients}
          onEditPatient={(p) => {
            setPatientToEdit(p);
            setIsPatientModalOpen(true);
          }}
          onDeletePatient={(id) => {
            setPatients(patients.filter(p => p.id !== id));
            // Optional: Also update appointments or show warning
          }}
          onNewPatient={() => {
            setPatientToEdit(null);
            setIsPatientModalOpen(true);
          }}
        />
      )}

      {isPatientModalOpen && (
        <PatientModal
          initialData={patientToEdit || undefined}
          onClose={() => {
            setIsPatientModalOpen(false);
            setPatientToEdit(null);
          }}
          onSave={(newPatient, id) => {
            if (id) {
              setPatients(patients.map(p => p.id === id ? { ...newPatient, id } : p));
            } else {
              setPatients([...patients, { ...newPatient, id: Math.random().toString(36).substr(2, 9) }]);
            }
            setIsPatientModalOpen(false);
            setPatientToEdit(null);
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

      {appointmentToCancel && (
        <ConfirmCancelModal
          patientName={appointmentToCancel.patientName}
          onClose={() => setAppointmentToCancel(null)}
          onConfirm={() => handleCancel(appointmentToCancel.id)}
        />
      )}

      {appointmentDetails && (
        <AppointmentDetailsModal
          appointment={appointmentDetails}
          onClose={() => setAppointmentDetails(null)}
          onEdit={() => {
            setAppointmentDetails(null);
            handleEdit(appointmentDetails);
          }}
          onCancel={() => {
            setAppointmentDetails(null);
            setAppointmentToCancel(appointmentDetails);
          }}
        />
      )}
    </div>
  );
}
