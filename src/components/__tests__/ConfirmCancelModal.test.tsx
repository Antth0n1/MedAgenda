import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ConfirmCancelModal from '../ConfirmCancelModal';

describe('ConfirmCancelModal Component', () => {
  it('renders correctly with patient name', () => {
    render(<ConfirmCancelModal onConfirm={vi.fn()} onClose={vi.fn()} patientName="João Silva" />);
    expect(screen.getByText(/João Silva/i)).toBeInTheDocument();
  });

  it('calls onConfirm when confirmed', () => {
    const onConfirmMock = vi.fn();
    const onCloseMock = vi.fn();
    render(<ConfirmCancelModal onConfirm={onConfirmMock} onClose={onCloseMock} patientName="Maria" />);
    
    fireEvent.click(screen.getByRole('button', { name: /sim, cancelar/i }));
    expect(onConfirmMock).toHaveBeenCalled();
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('calls onClose when returning', () => {
    const onCloseMock = vi.fn();
    render(<ConfirmCancelModal onConfirm={vi.fn()} onClose={onCloseMock} patientName="Maria" />);
    
    fireEvent.click(screen.getByRole('button', { name: /voltar/i }));
    expect(onCloseMock).toHaveBeenCalled();
  });
});
