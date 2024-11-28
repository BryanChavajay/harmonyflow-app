import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { LayoutWithSidebar } from "../../layouts/WithSidebar.jsx";
import { TableProjects } from "./components/table.jsx";
import {RegisterProject} from './components/modals.jsx'

export const Project = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [information, setInformation] = useState({});
  const [searching, setSearching] = useState("");

  const URL = import.meta.env.VITE_API_URL;
  const TOKEN = localStorage.getItem("token");

  const getUsers = async (page = 1, pageSize = 10) => {
    try {
      setIsLoading(true);
      setSearching("");
      const response = await fetch(
        `${URL}/proyectos/?page=${page}&pageSize${pageSize}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      const jsonResponse = await response.json();
      if (!response.ok) {
        return toast.error(
          jsonResponse.message || "Algo salió mal, comuníquese con soporte"
        );
      }

      setData(jsonResponse.data.data);
      setInformation({
        total: jsonResponse.data.total,
        totalPages: jsonResponse.data.totalPages,
        currenPage: jsonResponse.data.currenPage,
        pageSize: jsonResponse.data.pageSize,
      });
    } catch (error) {
      console.log(error);
      toast.error("Algo salió mal, comuníquese con soporte");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <LayoutWithSidebar>
      <div className="w-full flex flex-col gap-4">
        <section className="flex justify-between">
          <p className="text-xl font-bold">PROYECTOS</p>
          <div className="px-4">
            <RegisterProject
              notification={toast}
              resetData={getUsers}
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
          <section>
            <TableProjects
              data={data}
              notification={toast}
              token={TOKEN}
              url={URL}
              resetData={getUsers}
            />
          </section>
        )}
        {isLoading ? (
          <p className="text-center">
            Cargando
            <span className="loading loading-dots loading-sm"></span>
          </p>
        ) : (
          <section className="flex flex-row items-center gap-x-2">
            <button
              className="btn btn-sm btn-ghost cursor-pointer"
              onClick={() => getUsers(information?.currenPage - 1)}
              disabled={information?.currenPage === 1}
            >
              Pagina Anteior
            </button>
            <button
              className="btn btn-sm btn-ghost cursor-pointer"
              onClick={() => getUsers(information?.currenPage + 1)}
              disabled={information?.currenPage === information?.totalPages}
            >
              Pagina Siguiente
            </button>
            <p className="text-sm font-bold">
              Página {information?.currenPage}/{information?.totalPages}
            </p>
          </section>
        )}
      </div>
      <Toaster richColors position="top-right" />
    </LayoutWithSidebar>
  );
};
