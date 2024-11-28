import { useDraggable, useDroppable } from "@dnd-kit/core";
import { Task } from "./DraggableItem.jsx";

export const Column = ({ column }) => {
  const { setNodeRef } = useDroppable({
    id: column.id_estado,
  });

  return (
    <div
      ref={setNodeRef}
      id={column.id_estado}
      className={`${
        column.id_estado === 3
          ? "bg-green-200"
          : column.id_estado === 2
          ? "bg-blue-200"
          : "bg-gray-200"
      } p-4 rounded shadow`}
    >
      <h3 className="text-lg font-bold">
        {column.id_estado === 1
          ? "EN PROGRESO"
          : column.id_estado === 2
          ? "EN CURSO"
          : "TERMINADA"}
      </h3>

      {column.tareas.map((task) => (
        <Task key={task.id_tarea} task={task} />
      ))}
    </div>
  );
};
