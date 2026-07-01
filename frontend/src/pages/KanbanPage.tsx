import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Plus } from 'lucide-react';

interface Tarea {
  id: string;
  titulo: string;
  descripcion?: string;
  prioridad: 'baja' | 'media' | 'alta' | 'critica';
  asignado?: string;
}

interface Columna {
  id: string;
  titulo: string;
  tareas: Tarea[];
}

export const KanbanPage: React.FC = () => {
  const [columnas, setColumnas] = useState<Columna[]>([
    {
      id: 'por_hacer',
      titulo: 'Por Hacer',
      tareas: [
        { id: '1', titulo: 'Diseñar landing page', prioridad: 'alta', asignado: 'Juan' },
        { id: '2', titulo: 'Setup base de datos', prioridad: 'critica', asignado: 'María' },
      ],
    },
    {
      id: 'en_progreso',
      titulo: 'En Progreso',
      tareas: [
        { id: '3', titulo: 'Implementar API', prioridad: 'alta', asignado: 'Pedro' },
      ],
    },
    {
      id: 'en_revision',
      titulo: 'En Revisión',
      tareas: [],
    },
    {
      id: 'completada',
      titulo: 'Completada',
      tareas: [
        { id: '4', titulo: 'Documentación', prioridad: 'media', asignado: 'Ana' },
      ],
    },
  ]);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const sourceColumna = columnas.find((c) => c.id === source.droppableId);
    const destColumna = columnas.find((c) => c.id === destination.droppableId);

    if (!sourceColumna || !destColumna) return;

    const tarea = sourceColumna.tareas[source.index];

    setColumnas((prev) =>
      prev.map((col) => {
        if (col.id === source.droppableId) {
          return {
            ...col,
            tareas: col.tareas.filter((_, i) => i !== source.index),
          };
        }
        if (col.id === destination.droppableId) {
          const newTareas = [...col.tareas];
          newTareas.splice(destination.index, 0, tarea);
          return { ...col, tareas: newTareas };
        }
        return col;
      }),
    );
  };

  const getPriorityColor = (prioridad: string) => {
    const colors: Record<string, string> = {
      baja: 'bg-green-100 text-green-800',
      media: 'bg-yellow-100 text-yellow-800',
      alta: 'bg-orange-100 text-orange-800',
      critica: 'bg-red-100 text-red-800',
    };
    return colors[prioridad] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Kanban - Gestión de Tareas</h1>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-4 gap-6">
            {columnas.map((columna) => (
              <Droppable key={columna.id} droppableId={columna.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`bg-gray-100 rounded-lg p-4 ${snapshot.isDraggingOver ? 'bg-blue-100' : ''}`}
                  >
                    <h3 className="font-bold text-lg mb-4 text-gray-900">{columna.titulo}</h3>

                    <div className="space-y-3">
                      {columna.tareas.map((tarea, index) => (
                        <Draggable key={tarea.id} draggableId={tarea.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white p-3 rounded-lg shadow-sm ${
                                snapshot.isDragging ? 'shadow-lg bg-blue-50' : ''
                              }`}
                            >
                              <p className="font-semibold text-gray-900 mb-2">{tarea.titulo}</p>
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(tarea.prioridad)}`}>
                                  {tarea.prioridad}
                                </span>
                              </div>
                              {tarea.asignado && (
                                <p className="text-sm text-gray-600">Asignado: {tarea.asignado}</p>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>

                    {provided.placeholder}

                    <button className="mt-4 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-200 transition flex items-center justify-center gap-2">
                      <Plus size={18} />
                      Agregar tarea
                    </button>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
    </Layout>
  );
};
