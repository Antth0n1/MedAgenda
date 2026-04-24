import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PatientModal from '../PatientModal';

describe('PatientModal Component', () => {
  it('renders creation form', () => {
    render(<PatientModal onClose={vi.fn()} onSave={vi.fn()} />);
    expect(screen.getByText('Cadastrar Paciente')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ex: Maria Silva')).toBeInTheDocument();
  });

  it('renders edit form with initial data', () => {
    const initialData = { id: '1', name: 'Ana', cpf: '123', address: 'Rua C', birthDate: '2000-01-01' };
    render(<PatientModal onClose={vi.fn()} onSave={vi.fn()} initialData={initialData} />);
    expect(screen.getByText('Editar Paciente')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Ana')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123')).toBeInTheDocument();
  });

  it('calls onSave with new data', async () => {
    const onSaveMock = vi.fn();
    render(<PatientModal onClose={vi.fn()} onSave={onSaveMock} />);
    
    fireEvent.change(screen.getByPlaceholderText('Ex: Maria Silva'), { target: { value: 'New Patient' } });
    fireEvent.change(screen.getByPlaceholderText('000.000.000-00'), { target: { value: '999' } });
    // Date and Address are required, filling them
    // Using aria or placeholder wasn't added for date, but it's okay for basic interaction
    const inputs = screen.getAllByRole('textbox');
    // Name, CPF, Address are textboxes. Date is by display value? Actually just query by label or something.
    // Address has placeholder
    fireEvent.change(screen.getByPlaceholderText('Rua, Número, Bairro, Cidade'), { target: { value: 'Rua D' } });
    
    // date input
    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: '1990-01-01' } });

    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    
    await waitFor(() => {
      expect(onSaveMock).toHaveBeenCalledWith({
        name: 'New Patient',
        cpf: '999',
        address: 'Rua D',
        birthDate: '1990-01-01'
      }, undefined);
    });
  });
});
