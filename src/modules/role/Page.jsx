import { Toaster, toast } from "sonner";
import { LayoutWithSidebar } from "../../layouts/WithSidebar.jsx";
import { TableRole } from "./components/Table.jsx";
import { useState, useEffect } from "react";
import { RegisterRole } from "./components/modals.jsx";

export const Role = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const getRol = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${URL}/roles/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
    getRol();
  }, []);

  return (
    <LayoutWithSidebar>
      <div className="w-full flex flex-col gap-4">
        <section className="flex justify-between">
          <p className="text-xl font-bold">ROLES</p>
          <div className="px-4">
            <RegisterRole
              resetData={getRol}
              notification={toast}
              url={URL}
              token={token}
            />
          </div>
        </section>
        <section>
          {isLoading ? (
            <p className="text-center">
              Cargando
              <span className="loading loading-dots loading-sm"></span>
            </p>
          ) : (
            <TableRole data={data} notification={toast} token={token} url={URL}/>
          )}
        </section>
      </div>
      <Toaster richColors position="top-right" />
    </LayoutWithSidebar>
  );
};
