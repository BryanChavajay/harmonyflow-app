import { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { Toaster, toast } from "sonner";
import { LayoutWithSidebar } from "../../layouts/WithSidebar.jsx";
import { Column } from "./components/DroppableColumn.jsx";
import { RegisterTask, RegisterHour } from "./components/Modals.jsx";

export const Board = () => {
  const URL = import.meta.env.VITE_API_URL;
  const TOKEN = localStorage.getItem("token");

  const [tasks, setTasks] = useState([]);
  const [prevTasks, setPrevTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [projectsCharged, setProjectsCharged] = useState(false);
  const [projects, setProjects] = useState([]);

  const getTasks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${URL}/tareas/agrupadas`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      const jsonResponse = await response.json();
      if (!response.ok) {
        console.log(jsonResponse.message);
        const message = "Algo salio mal al buscar las tares de su agenda";
        toast.error(message);
        return;
      }

      setTasks(jsonResponse.data);
      setPrevTasks(jsonResponse.data);
    } catch (error) {
      console.log(error);
      toast.error("Ocurrió un problema inesperado, comuníquese con soporte");
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (url) => {
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      // const jsonResponse = await response.json();
      if (!response.ok) {
        // console.log(jsonResponse);
        const message = "No se pudo actualizar la tarea";
        toast.error(message);
        setTasks(prevTasks);

        return;
      }

      getTasks();
      toast.success("Tarea actualiza con exito");
    } catch (error) {
      console.log(error);
      toast.error("Ocurrió un problema inesperado, comuníquese con soporte");
    }
  };

  const onDragEnd = ({ active, over }) => {
    if (!over) return;

    const sourceColumnIndex = tasks.findIndex((col) =>
      col.tareas.some((task) => task.id_tarea === Number(active.id))
    );
    const targetColumnIndex = tasks.findIndex(
      (col) => col.id_estado === Number(over.id)
    );

    if (sourceColumnIndex === -1 || targetColumnIndex === -1) return;

    const sourceColumn = tasks[sourceColumnIndex];
    const targetColumn = tasks[targetColumnIndex];

    const task = sourceColumn.tareas.find(
      (t) => t.id_tarea === Number(active.id)
    );

    // Cambio optimista
    const updatedSourceTasks = sourceColumn.tareas.filter(
      (t) => t.id_tarea !== task.id_tarea
    );
    const updatedTargetTasks = [...targetColumn.tareas, task];

    const updatedColumns = [...tasks];
    updatedColumns[sourceColumnIndex] = {
      ...sourceColumn,
      tareas: updatedSourceTasks,
    };
    updatedColumns[targetColumnIndex] = {
      ...targetColumn,
      tareas: updatedTargetTasks,
    };

    setTasks(updatedColumns);
    // console.log("Tarea movida:", task.id_tarea);
    // console.log("Nuevo estado:", targetColumn.id_estado);
    let url = "";
    if (parseInt(targetColumn.id_estado) === 1) {
      url = `${URL}/tareas/progreso?id=${task.id_tarea}`;
    } else if (parseInt(targetColumn.id_estado) === 2) {
      url = `${URL}/tareas/curso?id=${task.id_tarea}`;
    } else {
      url = `${URL}/tareas/completada?id=${task.id_tarea}`;
    }

    updateTask(url);
  };

  const getProjects = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${URL}/proyectos/misproyectos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      const jsonResponse = await response.json();
      if (!response.ok) {
        console.log(jsonResponse.message);
        const message = "Algo salió mal, comuníquese con soporte";
        toast.error(message);
        return;
      }

      toast.success(jsonResponse.message);
      const projects = jsonResponse.data.map((role) => ({
        value: role.id_proyecto,
        label: role.nombre,
      }));

      setProjects(projects);
      setProjectsCharged(true);
    } catch (error) {
      console.log(error);
      toast.error("Ocurrió un problema inesperado, comuníquese con soporte");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
    getProjects();
  }, []);

  return (
    <LayoutWithSidebar>
      <div className="w-full flex flex-col gap-4">
        <section className="flex justify-between items-center">
          <p className="text-xl font-bold">Tablero de tareas</p>
          <div className="flex flex-row gap-x-4">
            <RegisterTask
              notification={toast}
              projects={projects}
              projectsCharged={projectsCharged}
              resetData={getTasks}
              token={TOKEN}
              url={URL}
            />
            <RegisterHour
              notification={toast}
              projects={projects}
              projectsCharged={projectsCharged}
              resetData={getTasks}
              token={TOKEN}
              url={URL}
            />
          </div>
        </section>
        {isLoading ? (
          <p className="text-center">
            Cargando
            <span className="loading loading-dots loading-sm"></span>
          </p>
        ) : (
          <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <div className="w-full h-[500px] grid grid-cols-3 gap-4 p-4">
              {tasks.map((column) => (
                <Column key={column.id_estado} column={column} />
              ))}
            </div>
          </DndContext>
        )}
      </div>
      <Toaster richColors position="top-right" />
    </LayoutWithSidebar>
  );
};
