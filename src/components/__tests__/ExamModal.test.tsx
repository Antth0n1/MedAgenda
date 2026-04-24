import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ExamModal from '../ExamModal';

describe('ExamModal Component', () => {
  it('renders creation form', () => {
    render(<ExamModal onClose={vi.fn()} onSave={vi.fn()} />);
    expect(screen.getByText('Cadastrar Exame')).toBeInTheDocument();
  });

  it('renders edit form with initial data', () => {
    const initialData = { id: '1', name: 'Sangue', specialty: 'Geral' };
    render(<ExamModal onClose={vi.fn()} onSave={vi.fn()} initialData={initialData} />);
    expect(screen.getByText('Editar Exame')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Sangue')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Geral')).toBeInTheDocument();
  });

  it('calls onSave with new data', async () => {
    const onSaveMock = vi.fn();
    render(<ExamModal onClose={vi.fn()} onSave={onSaveMock} />);
    
    const nameInput = screen.getByPlaceholderText('Ex: Ecocardiograma');
    const specInput = screen.getByPlaceholderText('Ex: Cardiologia');
    
    fireEvent.change(nameInput, { target: { value: 'Raio X' } });
    fireEvent.change(specInput, { target: { value: 'Ortopedia' } });

    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    
    await waitFor(() => {
      expect(onSaveMock).toHaveBeenCalledWith({
        name: 'Raio X',
        specialty: 'Ortopedia',
      }, undefined);
    });
  });
});
