import { useState, useEffect } from "react";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  LineChart,
  Line,
} from "recharts";
import { Toaster, toast } from "sonner";
import { LayoutWithSidebar } from "../../layouts/WithSidebar.jsx";

export const Estadistics = () => {
  const URL = import.meta.env.VITE_API_URL;
  const TOKEN = localStorage.getItem("token");

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dataCasesProjects, setDataCasesProjects] = useState([]);

  const getProjects = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${URL}/estadisticas/costoproyectos`, {
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
      const projects = jsonResponse.data.map((item) => ({
        name: item.nombre,
        costoEstimado: parseFloat(item.costo_estimado),
        costoTotal: parseFloat(item.costo_total),
      }));

      setData(projects);
    } catch (error) {
      console.log(error);
      toast.error("Ocurrió un problema inesperado, comuníquese con soporte");
    } finally {
      setIsLoading(false);
    }
  };

  const getCaseProjects = async () => {
    try {
      if (dataCasesProjects.length > 0) {
        return;
      }
      setIsLoading(true);
      const response = await fetch(`${URL}/estadisticas/pruebasproyectos`, {
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
      // console.log(jsonResponse);
      const projects = jsonResponse.data.map((item) => ({
        name: item.nombre,
        value: parseFloat(item.cantidad_casos),
      }));

      setDataCasesProjects(projects);
    } catch (error) {
      console.log(error);
      toast.error("Ocurrió un problema inesperado, comuníquese con soporte");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <LayoutWithSidebar>
      <article>
        <p className="text-xl font-bold mb-8">Estadisticas de los proyectos</p>
      </article>
      <section className="w-full">
        <div role="tablist" className="tabs tabs-lifted">
          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            className="tab"
            aria-label="Costos"
            defaultChecked
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <div className="w-full flex flex-col items-center">
              <article className="">
                <p className="text-xl font-bold">Costo de los proyectos</p>
              </article>
              <BarChart width={900} height={500} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="costoEstimado" fill="#8884d8" />
                <Bar dataKey="costoTotal" fill="#82ca9d" />
              </BarChart>
            </div>
          </div>

          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            className="tab"
            aria-label="Pruebas"
            onClick={getCaseProjects}
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <div className="w-full flex flex-col items-center">
              <article className="">
                <p className="text-xl font-bold">
                  Cantidad de pruebas registradas por proyecto
                </p>
              </article>
              <LineChart
                width={900}
                height={500}
                data={dataCasesProjects}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </div>
          </div>
        </div>
      </section>
      <Toaster richColors position="top-right" />
    </LayoutWithSidebar>
  );
};
