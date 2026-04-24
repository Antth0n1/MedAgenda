import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AppointmentDetailsModal from '../AppointmentDetailsModal';

describe('AppointmentDetailsModal Component', () => {
  const mockAppointment = {
    id: '1',
    patientName: 'João da Silva',
    type: 'consulta' as const,
    doctorName: 'Dr. Marcos',
    specialty: 'Cardiologia',
    date: '2030-10-10',
    time: '14:00',
    status: 'scheduled' as const,
    observations: 'Paciente relata dores no peito',
  };

  it('renders correct details', () => {
    render(<AppointmentDetailsModal appointment={mockAppointment} onClose={vi.fn()} onEdit={vi.fn()} onCancel={vi.fn()} />);
    
    expect(screen.getByText('João da Silva')).toBeInTheDocument();
    expect(screen.getByText(/Cardiologia/)).toBeInTheDocument();
    expect(screen.getByText('Paciente relata dores no peito')).toBeInTheDocument();
    expect(screen.getByText('14:00')).toBeInTheDocument();
  });

  it('triggers onEdit and onCancel', () => {
    const onEditMock = vi.fn();
    const onCancelMock = vi.fn();
    
    render(<AppointmentDetailsModal appointment={mockAppointment} onClose={vi.fn()} onEdit={onEditMock} onCancel={onCancelMock} />);
    
    fireEvent.click(screen.getByRole('button', { name: /editar/i }));
    expect(onEditMock).toHaveBeenCalled();
    
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(onCancelMock).toHaveBeenCalled();
  });
});
