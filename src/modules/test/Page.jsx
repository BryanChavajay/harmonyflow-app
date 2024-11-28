import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { Link, useParams } from "react-router-dom";
import { LayoutWithSidebar } from "../../layouts/WithSidebar.jsx";
import { TableCases, TableCampTest, TableErrors } from "./components/Table.jsx";
import { CaseTestForm } from "./components/Forms.jsx";
import { RegisterError, ExecuteTest } from "./components/Modals.jsx";

export const Test = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const URL = import.meta.env.VITE_API_URL;
  const TOKEN = localStorage.getItem("token");

  const getCases = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${URL}/pruebas/casos`, {
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
    } catch (error) {
      console.log(error);
      toast.error("Algo salió mal, comuníquese con soporte");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCases();
  }, []);

  return (
    <LayoutWithSidebar>
      <div className="w-full flex flex-col gap-4">
        <section className="flex justify-between">
          <p className="text-xl font-bold">CASOS DE PRUEBAS REGISTRADOS</p>
          <div className="px-4">
            <Link to="/pruebas/registrarcaso" className="btn btn-success">
              REGISTRA CASO DE PRUEBA
            </Link>
          </div>
        </section>
        {isLoading ? (
          <p className="text-center">
            Cargando
            <span className="loading loading-dots loading-sm"></span>
          </p>
        ) : (
          <section>
            <TableCases
              data={data}
              notification={toast}
              token={TOKEN}
              url={URL}
              resetData={getCases}
            />
          </section>
        )}
      </div>
      <Toaster richColors position="top-right" />
    </LayoutWithSidebar>
  );
};

export const CaseTest = () => {
  const [projects, setProjects] = useState([]);
  const [projectsCharged, setProjectsCharged] = useState(false);

  const URL = import.meta.env.VITE_API_URL;
  const TOKEN = localStorage.getItem("token");

  const getProjects = async () => {
    try {
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
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <LayoutWithSidebar>
      <div className="w-full flex flex-col gap-4">
        <article className="">
          <p className="text-xl font-bold">Registrando caso de prueba</p>
        </article>
        <CaseTestForm
          projects={projects}
          projectsCharged={projectsCharged}
          notification={toast}
          token={TOKEN}
          url={URL}
        />
      </div>
      <Toaster richColors position="top-right" />
    </LayoutWithSidebar>
  );
};

export const ViewTest = () => {
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
          <p className="text-xl font-bold">{`Detalle del caso de prueba No. ${idCaseTest}`}</p>
          <div className="flex flex-row gap-x-4">
            {data?.PruebaAuto !== null && (
              <ExecuteTest
                campsTest={campsTest}
                idCaseTest={data.PruebaAuto?.id_prueba_automatizada}
                notification={toast}
                resetData={getCase}
                token={TOKEN}
                url={URL}
                expectedState={data.PruebaAuto?.estado_esperado}
              />
            )}
            <RegisterError
              idCaseTest={idCaseTest}
              notification={toast}
              resetData={getCase}
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
                <p className="font-bold text-lg">Estado esperado</p>
                <div className="badge badge-accent gap-2">
                  {data.PruebaAuto?.estado_esperado}
                </div>
                <p className="font-bold text-lg">Resultado:</p>
                {data.PruebaAuto?.correcto ? (
                  <div className="badge badge-success gap-2">CORRECTO</div>
                ) : (
                  <div className="badge badge-error gap-2">INCORRECTO</div>
                )}
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
        <section className="w-full p-4 bordered border-2 rounded-md bg-red-50">
          <h3 className="text-base font-bold">Errores registrados</h3>
          <TableErrors data={errors} />
        </section>
      </div>
      <Toaster richColors position="top-right" />
    </LayoutWithSidebar>
  );
};
