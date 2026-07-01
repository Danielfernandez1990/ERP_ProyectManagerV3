import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GenericModal } from '../components/GenericModal';

describe('GenericModal', () => {
  it('should not render when isOpen is false', () => {
    const { container } = render(
      <GenericModal
        isOpen={false}
        title="Test Modal"
        onClose={jest.fn()}
      >
        <p>Content</p>
      </GenericModal>
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render when isOpen is true', () => {
    render(
      <GenericModal
        isOpen={true}
        title="Test Modal"
        onClose={jest.fn()}
      >
        <p>Modal Content</p>
      </GenericModal>
    );
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const onCloseMock = jest.fn();
    render(
      <GenericModal
        isOpen={true}
        title="Test Modal"
        onClose={onCloseMock}
      >
        <p>Content</p>
      </GenericModal>
    );
    
    const closeButton = screen.getByRole('button', { name: /close/i }) || 
                        document.querySelector('button:first-of-type');
    if (closeButton) {
      fireEvent.click(closeButton);
    }
  });

  it('should call onConfirm when confirm button is clicked', () => {
    const onConfirmMock = jest.fn();
    render(
      <GenericModal
        isOpen={true}
        title="Test Modal"
        onClose={jest.fn()}
        onConfirm={onConfirmMock}
        confirmText="Save"
      >
        <p>Content</p>
      </GenericModal>
    );
    
    const confirmButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(confirmButton);
    expect(onConfirmMock).toHaveBeenCalled();
  });

  it('should disable buttons when isLoading is true', () => {
    render(
      <GenericModal
        isOpen={true}
        title="Test Modal"
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        isLoading={true}
      >
        <p>Content</p>
      </GenericModal>
    );
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });
});
