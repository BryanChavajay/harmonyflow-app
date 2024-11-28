import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { LayoutWithSidebar } from "../../layouts/WithSidebar.jsx";
import { TableLines, TableUsersLine } from "./components/table.jsx";
import { RegisterLine } from "./components/modals.jsx";
import { useParams } from "react-router-dom";
import { RegisterUserLine } from "./components/modals.jsx";

export const Lineas = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [information, setInformation] = useState({});

  const URL = import.meta.env.VITE_API_URL;
  const TOKEN = localStorage.getItem("token");

  const getLines = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`${URL}/lineas/`, {
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

      setData(jsonResponse.data);
    } catch (error) {
      console.log(error);
      toast.error("Algo salió mal, comuníquese con soporte");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getLines();
  }, []);

  return (
    <LayoutWithSidebar>
      <div className="w-full flex flex-col gap-4">
        <section className="flex justify-between">
          <p className="text-xl font-bold">LINEAS DE DESARROLLO</p>
          <div className="px-4">
            <RegisterLine
              notification={toast}
              resetData={getLines}
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
            <TableLines
              data={data}
              notification={toast}
              token={TOKEN}
              url={URL}
              resetData={getLines}
            />
          </section>
        )}
      </div>
      <Toaster richColors position="top-right" />
    </LayoutWithSidebar>
  );
};

export const LineDetail = () => {
  const { idLine } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [lineName, setLineName] = useState("");
  const [userOfLine, setUserOfLine] = useState([]);

  const URL = import.meta.env.VITE_API_URL;
  const TOKEN = localStorage.getItem("token");

  const getLine = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${URL}/lineas/usuarioslinea?id=${idLine}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      const jsonResponse = await response.json();
      if (!response.ok) {
        console.log(jsonResponse.message);
        const message =
          "Algo salió mal, al buscar la linea comuníquese con soporte";
        notification.error(message);
        return;
      }

      setLineName(jsonResponse.data.linea);
      setUserOfLine(jsonResponse.data.usuarios);
    } catch (error) {
      console.log(error);
      notification.error(
        "Ocurrió un problema inesperado, comuníquese con soporte"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getLine();
  }, []);

  return (
    <LayoutWithSidebar>
      <div className="w-full flex flex-col gap-4">
        <section className="flex justify-between">
          <p className="text-xl font-bold">{`Detalles de la linea: ${idLine} - ${lineName}`}</p>
          <div className="px-4">
            {idLine != 1 ? (
              <RegisterUserLine
                notification={toast}
                resetData={getLine}
                token={TOKEN}
                url={URL}
                idLine={idLine}
                nameLine={lineName}
                users={userOfLine}
              />
            ) : null}
          </div>
        </section>
        {isLoading ? (
          <p className="text-center">
            Cargando
            <span className="loading loading-dots loading-sm"></span>
          </p>
        ) : (
          <section>
            <TableUsersLine
              data={userOfLine}
              notification={toast}
              token={TOKEN}
              url={URL}
              resetData={getLine}
            />
          </section>
        )}
      </div>
      <Toaster richColors position="top-right" />
    </LayoutWithSidebar>
  );
};
