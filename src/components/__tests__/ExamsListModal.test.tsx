import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ExamsListModal from '../ExamsListModal';
import { Exam } from '../../types';

describe('ExamsListModal Component', () => {
  const mockExams: Exam[] = [
    { id: '1', name: 'Ressonância Magnética', specialty: 'Neurologia' },
    { id: '2', name: 'Ecocardiograma', specialty: 'Cardiologia' },
  ];

  it('renders exams list', () => {
    render(
      <ExamsListModal 
        exams={mockExams} 
        onClose={vi.fn()} 
        onEditExam={vi.fn()} 
        onDeleteExam={vi.fn()} 
        onNewExam={vi.fn()} 
      />
    );
    
    expect(screen.getByText('Ressonância Magnética')).toBeInTheDocument();
    expect(screen.getByText('Ecocardiograma')).toBeInTheDocument();
  });

  it('triggers delete confirmation and onDeleteExam', () => {
    const onDeleteMock = vi.fn();
    window.confirm = vi.fn().mockReturnValue(true);
    
    render(
      <ExamsListModal 
        exams={mockExams} 
        onClose={vi.fn()} 
        onEditExam={vi.fn()} 
        onDeleteExam={onDeleteMock} 
        onNewExam={vi.fn()} 
      />
    );
    
    const deleteButtons = screen.getAllByTitle('Excluir');
    fireEvent.click(deleteButtons[0]);
    
    expect(window.confirm).toHaveBeenCalledWith('Tem certeza que deseja excluir Ressonância Magnética?');
    expect(onDeleteMock).toHaveBeenCalledWith('1');
  });
});
