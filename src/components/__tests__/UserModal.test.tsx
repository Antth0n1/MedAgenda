import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import UserModal from '../UserModal';

describe('UserModal Component', () => {
  it('renders creation form', () => {
    render(<UserModal onClose={vi.fn()} onSave={vi.fn()} />);
    expect(screen.getByText('Novo Usuário')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ex: joao.silva')).toBeInTheDocument();
  });

  it('renders edit form with initial data', () => {
    const initialData = { name: 'lucas', password: 'password', role: 'Médico(a)' };
    render(<UserModal onClose={vi.fn()} onSave={vi.fn()} initialData={initialData} />);
    expect(screen.getByText('Editar Usuário')).toBeInTheDocument();
    expect(screen.getByDisplayValue('lucas')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Médico(a)')).toBeInTheDocument();
  });

  it('calls onSave with correct data when submitted', async () => {
    const onSaveMock = vi.fn();
    render(<UserModal onClose={vi.fn()} onSave={onSaveMock} />);
    
    fireEvent.change(screen.getByPlaceholderText('Ex: joao.silva'), { target: { value: 'newuser' } });
    fireEvent.change(screen.getByPlaceholderText('Mínimo 6 caracteres'), { target: { value: '123456' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Administrador' } });
    
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    
    await waitFor(() => {
      expect(onSaveMock).toHaveBeenCalledWith({ name: 'newuser', password: '123456', role: 'Administrador' }, undefined);
    });
  });
  
  it('calls onClose when close button or cancel is clicked', () => {
    const onCloseMock = vi.fn();
    render(<UserModal onClose={onCloseMock} onSave={vi.fn()} />);
    
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(onCloseMock).toHaveBeenCalled();
  });
});
