import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DoctorsListModal from '../DoctorsListModal';
import { Doctor } from '../../types';

describe('DoctorsListModal Component', () => {
  const mockDoctors: Doctor[] = [
    { id: '1', name: 'Dr. House', specialty: 'Diagnóstico' },
    { id: '2', name: 'Dra. Grey', specialty: 'Cirurgia' },
  ];

  it('renders doctors list', () => {
    render(
      <DoctorsListModal 
        doctors={mockDoctors} 
        onClose={vi.fn()} 
        onEditDoctor={vi.fn()} 
        onDeleteDoctor={vi.fn()} 
        onNewDoctor={vi.fn()} 
      />
    );
    
    expect(screen.getByText('Dr. House')).toBeInTheDocument();
    expect(screen.getByText('Dra. Grey')).toBeInTheDocument();
  });

  it('triggers delete confirmation and onDeleteDoctor', () => {
    const onDeleteMock = vi.fn();
    window.confirm = vi.fn().mockReturnValue(true);
    
    render(
      <DoctorsListModal 
        doctors={mockDoctors} 
        onClose={vi.fn()} 
        onEditDoctor={vi.fn()} 
        onDeleteDoctor={onDeleteMock} 
        onNewDoctor={vi.fn()} 
      />
    );
    
    const deleteButtons = screen.getAllByTitle('Excluir');
    fireEvent.click(deleteButtons[0]);
    
    expect(window.confirm).toHaveBeenCalledWith('Tem certeza que deseja excluir Dr. House?');
    expect(onDeleteMock).toHaveBeenCalledWith('1');
  });
});
