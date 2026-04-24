import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DoctorModal from '../DoctorModal';

describe('DoctorModal Component', () => {
  it('renders creation form', () => {
    render(<DoctorModal onClose={vi.fn()} onSave={vi.fn()} />);
    expect(screen.getByText('Cadastrar Médico')).toBeInTheDocument();
  });

  it('renders edit form with initial data', () => {
    const initialData = { id: '1', name: 'Dr. John', specialty: 'Neurologia' };
    render(<DoctorModal onClose={vi.fn()} onSave={vi.fn()} initialData={initialData} />);
    expect(screen.getByText('Editar Médico')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Dr. John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Neurologia')).toBeInTheDocument();
  });

  it('calls onSave with new data', async () => {
    const onSaveMock = vi.fn();
    render(<DoctorModal onClose={vi.fn()} onSave={onSaveMock} />);
    
    // There are 'Nome do Médico' and 'Especialidade'
    // Textboxes don't have distinct labels easily queried if they don't have 'for', which they don't.
    const nameInput = screen.getByPlaceholderText('Ex: Dr. Carlos Mendes');
    const specInput = screen.getByPlaceholderText('Ex: Cardiologia');
    
    fireEvent.change(nameInput, { target: { value: 'Dra. Silva' } });
    fireEvent.change(specInput, { target: { value: 'Pediatra' } });

    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    
    await waitFor(() => {
      expect(onSaveMock).toHaveBeenCalledWith({
        name: 'Dra. Silva',
        specialty: 'Pediatra',
      }, undefined);
    });
  });
});
