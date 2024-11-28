import { useDraggable } from "@dnd-kit/core";

export const Task = ({ task }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
      useDraggable({
        id: task.id_tarea,
      });
  
    const style = {
      transform: transform
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : undefined,
      opacity: isDragging ? 0.5 : 1,
    };
  
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-white p-2 my-2 rounded shadow cursor-pointer"
      >
        <p className="font-bold">{task.nombre_tarea}</p>
        <p className="text-sm">{task.descripcion_tarea}</p>
        <p className="text-sm">Finaliza: {task.fecha_finalizacion}</p>
      </div>
    );
  };