import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Login from '../Login';
import { RegisteredUser } from '../../types';

describe('Login Component', () => {
  const mockRegisteredUsers: RegisteredUser[] = [
    { name: 'testuser', password: 'password123', role: 'Administrador' }
  ];

  it('renders login form correctly', () => {
    render(<Login onLogin={vi.fn()} registeredUsers={mockRegisteredUsers} />);
    expect(screen.getByText('Bem-vindo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Usuário')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument();
  });

  it('shows error on invalid credentials', async () => {
    const onLoginMock = vi.fn();
    render(<Login onLogin={onLoginMock} registeredUsers={mockRegisteredUsers} />);
    
    fireEvent.change(screen.getByPlaceholderText('Usuário'), { target: { value: 'wrong' } });
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'pass' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Usuário ou senha incorretos')).toBeInTheDocument();
    });
    expect(onLoginMock).not.toHaveBeenCalled();
  });

  it('calls onLogin on valid credentials', async () => {
    const onLoginMock = vi.fn();
    render(<Login onLogin={onLoginMock} registeredUsers={mockRegisteredUsers} />);
    
    fireEvent.change(screen.getByPlaceholderText('Usuário'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    
    await waitFor(() => {
      expect(onLoginMock).toHaveBeenCalledWith({ name: 'testuser', role: 'Administrador' });
    });
    expect(screen.queryByText('Usuário ou senha incorretos')).not.toBeInTheDocument();
  });
});
