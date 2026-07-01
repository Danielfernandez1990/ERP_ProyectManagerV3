import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GenericTable } from '../components/GenericTable';

interface TestData {
  id: number;
  name: string;
  email: string;
}

const mockData: TestData[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

const mockColumns = [
  { key: 'name' as const, label: 'Name' },
  { key: 'email' as const, label: 'Email' },
];

describe('GenericTable', () => {
  it('should render empty message when data is empty', () => {
    render(
      <GenericTable
        data={[]}
        columns={mockColumns}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );
    
    expect(screen.getByText('No hay datos para mostrar')).toBeInTheDocument();
  });

  it('should render table with data', () => {
    render(
      <GenericTable
        data={mockData}
        columns={mockColumns}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('should render column headers', () => {
    render(
      <GenericTable
        data={mockData}
        columns={mockColumns}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );
    
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Acciones')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    const onEditMock = jest.fn();
    render(
      <GenericTable
        data={mockData}
        columns={mockColumns}
        onEdit={onEditMock}
        onDelete={jest.fn()}
      />
    );
    
    const editButtons = screen.getAllByRole('button');
    const firstEditButton = editButtons[0];
    fireEvent.click(firstEditButton);
    
    expect(onEditMock).toHaveBeenCalledWith(mockData[0]);
  });

  it('should call onDelete when delete button is clicked', () => {
    const onDeleteMock = jest.fn();
    render(
      <GenericTable
        data={mockData}
        columns={mockColumns}
        onEdit={jest.fn()}
        onDelete={onDeleteMock}
      />
    );
    
    const buttons = screen.getAllByRole('button');
    const firstDeleteButton = buttons[1];
    fireEvent.click(firstDeleteButton);
    
    expect(onDeleteMock).toHaveBeenCalledWith(1);
  });

  it('should render custom column renderer', () => {
    const customColumns = [
      {
        key: 'name' as const,
        label: 'Name',
        render: (value: string) => <strong>{value}</strong>,
      },
    ];
    
    render(
      <GenericTable
        data={mockData}
        columns={customColumns}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );
    
    expect(screen.getByText('John Doe').tagName).toBe('STRONG');
  });

  it('should disable buttons when isLoading is true', () => {
    render(
      <GenericTable
        data={mockData}
        columns={mockColumns}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        isLoading={true}
      />
    );
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });
});
