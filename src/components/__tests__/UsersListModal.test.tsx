import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import UsersListModal from '../UsersListModal';

describe('UsersListModal Component', () => {
  const mockUsers = [
    { name: 'admin', password: '123', role: 'Administrador' },
    { name: 'recep', password: '123', role: 'Recepcionista' },
  ];

  it('shows users list', () => {
    render(
      <UsersListModal 
        users={mockUsers} 
        currentUser={mockUsers[0]} 
        onClose={vi.fn()} 
        onEditUser={vi.fn()} 
        onNewUser={vi.fn()} 
      />
    );
    
    expect(screen.getByText('admin (Você)')).toBeInTheDocument();
    expect(screen.getByText('recep')).toBeInTheDocument();
  });

  it('shows new user button only for Admin', () => {
    const { rerender } = render(
      <UsersListModal 
        users={mockUsers} 
        currentUser={mockUsers[0]} 
        onClose={vi.fn()} 
        onEditUser={vi.fn()} 
        onNewUser={vi.fn()} 
      />
    );
    
    expect(screen.getByText('+ Novo Usuário')).toBeInTheDocument();
    
    rerender(
      <UsersListModal 
        users={mockUsers} 
        currentUser={mockUsers[1]} 
        onClose={vi.fn()} 
        onEditUser={vi.fn()} 
        onNewUser={vi.fn()} 
      />
    );
    
    expect(screen.queryByText('+ Novo Usuário')).not.toBeInTheDocument();
  });
});
