export interface Doctor {
  id: string;
  name: string;
  specialty: string;
}

export interface Exam {
  id: string;
  name: string;
  specialty: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  type: 'consulta' | 'exame';
  doctorName?: string;
  specialty?: string;
  examName?: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'canceled';
}

export interface User {
  name: string;
  role: string;
}

export interface RegisteredUser extends User {
  password?: string;
}
