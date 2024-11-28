import { useState, useEffect } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import { LayoutWithSidebar } from "../../layouts/WithSidebar";
import { RegisterTask, RegisterHour } from "../board/components/Modals.jsx";
import { toast, Toaster } from "sonner";

export const Agenda = () => {
  const localizer = dayjsLocalizer(dayjs);

  const URL = import.meta.env.VITE_API_URL;
  const TOKEN = localStorage.getItem("token");

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [projectsCharged, setProjectsCharged] = useState(false);
  const [projects, setProjects] = useState([]);

  const getTasks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${URL}/tareas/`, {
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

      const arrayTasks = jsonResponse.data.map((task) => ({
        start: dayjs(task.fecha_inicio).toDate(),
        end: dayjs(task.fecha_finalizacion).toDate(),
        title: task.nombre_tarea,
      }));
      setTasks(arrayTasks);
    } catch (error) {
      console.log(error);
      toast.error(
        "Ocurrió un problema inesperado, comuníquese con soporte"
      );
    } finally {
      setIsLoading(false);
    }
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
        <section className="flex justify-between">
          <p className="text-lg font-bold">AGENDA CON MIS TAREAS</p>
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
        <section className="w-full h-[565px]">
          <Calendar localizer={localizer} events={tasks} />
        </section>
      </div>
      <Toaster richColors position="top-right" />
    </LayoutWithSidebar>
  );
};
