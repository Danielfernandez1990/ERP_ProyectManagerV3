import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProvided,
  DroppableStateSnapshot,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';
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
  color: string;
  tareas: Tarea[];
}

const INITIAL_COLUMNS: Columna[] = [
  {
    id: 'por_hacer',
    titulo: 'Por Hacer',
    color: 'bg-gray-200',
    tareas: [
      { id: '1', titulo: 'Diseñar landing page', prioridad: 'alta', asignado: 'Juan' },
      { id: '2', titulo: 'Setup base de datos', prioridad: 'critica', asignado: 'María' },
    ],
  },
  {
    id: 'en_progreso',
    titulo: 'En Progreso',
    color: 'bg-blue-100',
    tareas: [
      { id: '3', titulo: 'Implementar API', prioridad: 'alta', asignado: 'Pedro' },
    ],
  },
  {
    id: 'en_revision',
    titulo: 'En Revisión',
    color: 'bg-yellow-100',
    tareas: [],
  },
  {
    id: 'completada',
    titulo: 'Completada',
    color: 'bg-green-100',
    tareas: [
      { id: '4', titulo: 'Documentación', prioridad: 'media', asignado: 'Ana' },
    ],
  },
];

const PRIORITY_COLORS: Record<string, string> = {
  baja:    'bg-green-100 text-green-800',
  media:   'bg-yellow-100 text-yellow-800',
  alta:    'bg-orange-100 text-orange-800',
  critica: 'bg-red-100 text-red-800',
};

export const KanbanPage: React.FC = () => {
  const [columnas, setColumnas] = useState<Columna[]>(INITIAL_COLUMNS);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    setColumnas((prev) => {
      const next = prev.map((c) => ({ ...c, tareas: [...c.tareas] }));
      const srcCol  = next.find((c) => c.id === source.droppableId)!;
      const dstCol  = next.find((c) => c.id === destination.droppableId)!;
      const [tarea] = srcCol.tareas.splice(source.index, 1);
      dstCol.tareas.splice(destination.index, 0, tarea);
      return next;
    });
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Kanban — Gestión de Tareas</h1>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-4 gap-4">
            {columnas.map((columna) => (
              <Droppable key={columna.id} droppableId={columna.id}>
                {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`rounded-lg p-4 min-h-[400px] ${
                      snapshot.isDraggingOver ? 'bg-blue-100' : columna.color
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900">{columna.titulo}</h3>
                      <span className="text-xs bg-white rounded-full px-2 py-0.5 font-semibold text-gray-600">
                        {columna.tareas.length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {columna.tareas.map((tarea, index) => (
                        <Draggable key={tarea.id} draggableId={tarea.id} index={index}>
                          {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white p-3 rounded-lg shadow-sm cursor-grab ${
                                snapshot.isDragging ? 'shadow-lg rotate-1' : ''
                              }`}
                            >
                              <p className="font-semibold text-gray-900 mb-2 text-sm">
                                {tarea.titulo}
                              </p>
                              <div className="flex items-center justify-between">
                                <span
                                  className={`text-xs px-2 py-0.5 rounded font-medium ${
                                    PRIORITY_COLORS[tarea.prioridad]
                                  }`}
                                >
                                  {tarea.prioridad}
                                </span>
                                {tarea.asignado && (
                                  <span className="text-xs text-gray-500">
                                    {tarea.asignado}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>

                    {provided.placeholder}

                    <button className="mt-3 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-white transition flex items-center justify-center gap-1 text-sm">
                      <Plus size={16} />
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
