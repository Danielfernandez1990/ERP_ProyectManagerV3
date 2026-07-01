import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UsuariosPage } from '../pages/UsuariosPage';
import * as api from '../services/api';

// Mock de la API
jest.mock('../services/api');

describe('UsuariosPage CRUD Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Read - Listar Usuarios', () => {
    it('should render usuarios table with data', async () => {
      const mockUsuarios = [
        {
          id: 1,
          email: 'admin@erp.local',
          nombre: 'Admin',
          apellido: 'Sistema',
          rol: 'SUPER_ADMIN',
          estado: 'activo',
        },
        {
          id: 2,
          email: 'test@erp.local',
          nombre: 'Test',
          apellido: 'User',
          rol: 'OPERARIO',
          estado: 'activo',
        },
      ];

      (api.usuariosApi.getAll as jest.Mock).mockResolvedValue({
        data: { data: mockUsuarios },
      });

      render(<UsuariosPage />);

      await waitFor(() => {
        expect(screen.getByText('admin@erp.local')).toBeInTheDocument();
        expect(screen.getByText('test@erp.local')).toBeInTheDocument();
      });
    });

    it('should display "No hay datos" when list is empty', async () => {
      (api.usuariosApi.getAll as jest.Mock).mockResolvedValue({
        data: { data: [] },
      });

      render(<UsuariosPage />);

      await waitFor(() => {
        expect(screen.getByText('No hay datos para mostrar')).toBeInTheDocument();
      });
    });
  });

  describe('Create - Crear Usuario', () => {
    it('should open modal when clicking "Nuevo Usuario"', async () => {
      (api.usuariosApi.getAll as jest.Mock).mockResolvedValue({
        data: { data: [] },
      });

      render(<UsuariosPage />);

      const createButton = screen.getByRole('button', { name: /nuevo usuario/i });
      fireEvent.click(createButton);

      await waitFor(() => {
        expect(screen.getByText('Crear Usuario')).toBeInTheDocument();
      });
    });

    it('should submit create form with valid data', async () => {
      (api.usuariosApi.getAll as jest.Mock).mockResolvedValue({
        data: { data: [] },
      });

      (api.usuariosApi.create as jest.Mock).mockResolvedValue({
        data: { id: 3, email: 'nuevo@erp.local' },
      });

      render(<UsuariosPage />);

      // Open modal
      const createButton = screen.getByRole('button', { name: /nuevo usuario/i });
      fireEvent.click(createButton);

      // Fill form
      const emailInput = screen.getByDisplayValue('') as HTMLInputElement;
      const user = userEvent.setup();

      await user.type(emailInput, 'nuevo@erp.local');
      // ... more form filling

      // Submit
      const saveButton = screen.getByRole('button', { name: /guardar/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(api.usuariosApi.create).toHaveBeenCalled();
      });
    });
  });

  describe('Update - Editar Usuario', () => {
    it('should open modal with data when clicking edit', async () => {
      const mockUsuario = {
        id: 1,
        email: 'admin@erp.local',
        nombre: 'Admin',
        apellido: 'Sistema',
        rol: 'SUPER_ADMIN',
        estado: 'activo',
      };

      (api.usuariosApi.getAll as jest.Mock).mockResolvedValue({
        data: { data: [mockUsuario] },
      });

      render(<UsuariosPage />);

      await waitFor(() => {
        expect(screen.getByText('admin@erp.local')).toBeInTheDocument();
      });

      // Click edit button
      const editButtons = screen.getAllByRole('button');
      const editButton = editButtons[0];
      fireEvent.click(editButton);

      await waitFor(() => {
        expect(screen.getByText('Editar Usuario')).toBeInTheDocument();
      });
    });

    it('should submit update with modified data', async () => {
      const mockUsuario = {
        id: 1,
        email: 'admin@erp.local',
        nombre: 'Admin',
        apellido: 'Sistema',
        rol: 'SUPER_ADMIN',
        estado: 'activo',
      };

      (api.usuariosApi.getAll as jest.Mock).mockResolvedValue({
        data: { data: [mockUsuario] },
      });

      (api.usuariosApi.update as jest.Mock).mockResolvedValue({
        data: mockUsuario,
      });

      render(<UsuariosPage />);

      await waitFor(() => {
        expect(screen.getByText('admin@erp.local')).toBeInTheDocument();
      });

      // Edit
      const editButtons = screen.getAllByRole('button');
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(api.usuariosApi.update).toHaveBeenCalledWith(
          1,
          expect.objectContaining({
            email: 'admin@erp.local',
          })
        );
      });
    });
  });

  describe('Delete - Eliminar Usuario', () => {
    it('should show confirmation dialog when clicking delete', async () => {
      const mockUsuario = {
        id: 1,
        email: 'admin@erp.local',
        nombre: 'Admin',
        apellido: 'Sistema',
        rol: 'SUPER_ADMIN',
        estado: 'activo',
      };

      (api.usuariosApi.getAll as jest.Mock).mockResolvedValue({
        data: { data: [mockUsuario] },
      });

      window.confirm = jest.fn(() => true);

      (api.usuariosApi.delete as jest.Mock).mockResolvedValue({});

      render(<UsuariosPage />);

      await waitFor(() => {
        expect(screen.getByText('admin@erp.local')).toBeInTheDocument();
      });

      // Get delete button (second icon button)
      const buttons = screen.getAllByRole('button');
      const deleteButton = buttons[buttons.length - 1];
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(window.confirm).toHaveBeenCalled();
        expect(api.usuariosApi.delete).toHaveBeenCalledWith(1);
      });
    });
  });

  describe('Error Handling', () => {
    it('should show error toast on API failure', async () => {
      (api.usuariosApi.getAll as jest.Mock).mockRejectedValue(
        new Error('API Error')
      );

      render(<UsuariosPage />);

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
    });
  });
});
