import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PatientsListModal from '../PatientsListModal';
import { Patient } from '../../types';

describe('PatientsListModal Component', () => {
  const mockPatients: Patient[] = [
    { id: '1', name: 'João Silva', cpf: '123.456.789-00', address: 'Rua A', birthDate: '1990-01-01' },
    { id: '2', name: 'Maria Souza', cpf: '098.765.432-11', address: 'Rua B', birthDate: '1985-05-05' },
  ];

  it('renders patient list', () => {
    render(
      <PatientsListModal 
        patients={mockPatients} 
        onClose={vi.fn()} 
        onEditPatient={vi.fn()} 
        onDeletePatient={vi.fn()} 
        onNewPatient={vi.fn()} 
      />
    );
    
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('123.456.789-00')).toBeInTheDocument();
    expect(screen.getByText('Maria Souza')).toBeInTheDocument();
  });

  it('triggers delete confirmation and onDeletePatient', () => {
    const onDeleteMock = vi.fn();
    window.confirm = vi.fn().mockReturnValue(true);
    
    render(
      <PatientsListModal 
        patients={mockPatients} 
        onClose={vi.fn()} 
        onEditPatient={vi.fn()} 
        onDeletePatient={onDeleteMock} 
        onNewPatient={vi.fn()} 
      />
    );
    
    // get all delete buttons
    const deleteButtons = screen.getAllByTitle('Excluir');
    fireEvent.click(deleteButtons[0]);
    
    expect(window.confirm).toHaveBeenCalledWith('Tem certeza que deseja excluir João Silva?');
    expect(onDeleteMock).toHaveBeenCalledWith('1');
  });
});
