import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { useParams } from "react-router-dom";
import { RegisterTask, RegisterHour } from "../board/components/Modals.jsx";
import { LayoutWithSidebar } from "../../layouts/WithSidebar";
import { TableTasks, TableErrors } from "./components/Table.jsx";
import { TableCampTest } from "../test/components/Table.jsx";

export const BackLog = () => {
  const URL = import.meta.env.VITE_API_URL;
  const TOKEN = localStorage.getItem("token");

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [projectsCharged, setProjectsCharged] = useState(false);
  const [projects, setProjects] = useState([]);
  const [errors, setErrors] = useState([]);

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
    } catch (error) {
      console.log(error);
      toast.error("Ocurrió un problema inesperado, comuníquese con soporte");
    } finally {
      setIsLoading(false);
    }
  };

  const getErrors = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${URL}/pruebas/errores`, {
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

      setErrors(jsonResponse.usuario);
    } catch (error) {
      console.log(error);
      toast.error("Ocurrió un problema inesperado, comuníquese con soporte");
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
    getErrors();
  }, []);

  return (
    <LayoutWithSidebar>
      <div className="w-full flex flex-col gap-4">
        <section className="flex justify-between items-center">
          <p className="font-bold text-xl">Backlog</p>
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
        <section className="flex flex-col gap-y-2">
          {tasks.map((detail) => (
            <div
              className={`collapse collapse-arrow ${
                detail.id_estado === 1
                  ? "bg-gray-200"
                  : detail.id_estado === 2
                  ? "bg-blue-200"
                  : "bg-green-200"
              }`}
              key={detail.id_estado}
            >
              <input type="radio" name="my-accordion-2" />
              <div className="collapse-title text-xl font-medium">
                {`${
                  detail.id_estado === 1
                    ? "EN PROGRESO"
                    : detail.id_estado === 2
                    ? "EN CURSO"
                    : "TERMINADO"
                }`}
              </div>
              <div className="collapse-content">
                <TableTasks
                  data={detail.tareas}
                  notification={toast}
                  resetData={getTasks}
                  token={TOKEN}
                  url={URL}
                  projects={projects}
                  projectsCharged={projectsCharged}
                />
              </div>
            </div>
          ))}
          <div className={"collapse collapse-arrow bg-red-200"}>
            <input type="radio" name="my-accordion-2" defaultChecked />
            <div className="collapse-title text-xl font-medium">ERRORES</div>
            <div className="collapse-content">
              <TableErrors
                data={errors}
                notification={toast}
                resetData={getErrors}
                token={TOKEN}
                url={URL}
              />
            </div>
          </div>
        </section>
      </div>
      <Toaster richColors position="top-right" />
    </LayoutWithSidebar>
  );
};

export const ViewError = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [campsTest, setCampsTest] = useState([]);
  const [errors, setErrors] = useState([]);

  const URL = import.meta.env.VITE_API_URL;
  const TOKEN = localStorage.getItem("token");

  const { idCaseTest } = useParams();

  const getCase = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${URL}/pruebas/${idCaseTest}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      const jsonResponse = await response.json();
      if (!response.ok) {
        return toast.error(
          jsonResponse.message || "Algo salió mal, comuníquese con soporte"
        );
      }

      setData(jsonResponse.usuario);
      if (jsonResponse.usuario.PruebaAuto !== null) {
        setCampsTest(jsonResponse.usuario.PruebaAuto.CampoPruebas);
      }
      setErrors(jsonResponse.usuario.errores);
    } catch (error) {
      console.log(error);
      toast.error("Algo salió mal, comuníquese con soporte");
    } finally {
      setIsLoading(false);
    }
  };

  const dataTypes = [
    { id: 1, label: "Número" },
    { id: 2, label: "String" },
  ];

  useEffect(() => {
    getCase();
  }, []);

  return (
    <LayoutWithSidebar>
      <div className="w-full flex flex-col gap-4">
        <section className="flex justify-between">
          <p className="text-xl font-bold">
            Caso de prueba del error reportado
          </p>
        </section>
        {isLoading ? (
          <p className="text-center">
            Cargando
            <span className="loading loading-dots loading-sm"></span>
          </p>
        ) : (
          <section className="w-full flex flex-col gap-y-2">
            <article className="flex flex-row gap-x-11 items-center bordered border-2 p-2 rounded-lg">
              <p className="font-bold text-lg">Nombre del caso:</p>
              <p>{data.nombre_caso}</p>
            </article>
            <article className="flex flex-row gap-x-4 items-center bordered border-2 p-2 rounded-lg">
              <p className="font-bold text-lg">Descripción del caso:</p>
              <p>{data.descripcion_caso}</p>
            </article>
            <article className="flex flex-row gap-x-11 items-center bordered border-2 p-2 rounded-lg">
              <p className="font-bold text-lg">Criterios del caso:</p>
              <p>{data.criterios_aceptacion}</p>
            </article>
            <article className="flex flex-row gap-x-11 items-center bordered border-2 p-2 rounded-lg">
              <p className="font-bold text-lg">Es automatizada:</p>
              {data.PruebaAuto === null ? (
                <div className="badge badge-accent gap-2">NO</div>
              ) : (
                <div className="badge badge-accent gap-2">SI</div>
              )}
            </article>
            {data.PruebaAuto !== null && (
              <article className="flex flex-row gap-x-11 items-center bordered border-2 p-2 rounded-lg">
                <p className="font-bold text-lg">Prueba ejecutada:</p>
                {data.PruebaAuto?.ejecutado ? (
                  <div className="badge badge-accent gap-2">SI</div>
                ) : (
                  <div className="badge badge-error gap-2">NO</div>
                )}
                <p className="font-bold text-lg">Estado esperado / devuelto</p>
                <div className="badge badge-accent gap-2">
                  {data.PruebaAuto?.estado_esperado} /{" "}
                  {data.PruebaAuto?.estado_devuelto}
                </div>
                {/* <p className="font-bold text-lg">Resultado:</p>
                {data.PruebaAuto?.correcto ? (
                  <div className="badge badge-success gap-2">CORRECTO</div>
                ) : (
                  <div className="badge badge-error gap-2">INCORRECTO</div>
                )} */}
              </article>
            )}
          </section>
        )}
        {data?.PruebaAuto !== null && (
          <section className="w-full p-4 bordered border-2 rounded-md bg-cyan-50">
            <h3 className="text-base font-bold">Campos registrados</h3>
            <TableCampTest data={campsTest} dataTypes={dataTypes} />
          </section>
        )}
        {/* <section className="w-full p-4 bordered border-2 rounded-md bg-red-50">
          <h3 className="text-base font-bold">Errores registrados</h3>
          <TableErrors data={errors} />
          </section> */}
        {data.PruebaAuto !== null && (
          <article className="w-full bg-gray-200 rounded-lg p-4">
            <p className="font-bold text-lg">Cuerpo de vuelto:</p>
            <p className="bg-white rounded-md p-2">{data.PruebaAuto?.cuerpo_devuelto}</p>
          </article>
        )}
      </div>
      <Toaster richColors position="top-right" />
    </LayoutWithSidebar>
  );
};
