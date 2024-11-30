import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useStoreAuth } from "../stores/GlobalAuth.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import { Login } from "./login/page.jsx";
import { Agenda } from "./agenda/page.jsx";
import { BackLog, ViewError } from "./backlog/page.jsx";
import { Board } from "./board/Page.jsx";
import { Estadistics } from "./estadistics/Page.jsx";
import { Lineas, LineDetail } from "./lines/Page.jsx";
import { Project } from "./project/Page.jsx";
import { Role } from "./role/Page.jsx";
import { Test, CaseTest, ViewTest } from "./test/page.jsx";
import { User } from "./user/User.jsx";

export const AppRouter = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const URL = import.meta.env.VITE_API_URL;
  const { resetAuth, setAuth } = useStoreAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      resetAuth();
      navigate("/");
      setIsLoading(false);
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(`${URL}/usuarios/verificar`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const jsonResponse = await response.json();
        if (!response.ok) {
          console.log(
            jsonResponse.message || "Algo salió mal, comuníquese con soporte"
          );
          localStorage.removeItem("token");
          resetAuth();
          navigate("/");
        } else {
          setAuth(jsonResponse.usuario.permisos, jsonResponse.usuario.usuario);
        }
      } catch (error) {
        console.log("Error al verificar el token:", error);
        localStorage.removeItem("token");
        resetAuth();
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [URL]);

  if (isLoading) {
    return (
      <div className="h-screen w-full">
        <span className="loading loading-spinner loading-lg text-info"></span>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route
        path="/agenda"
        element={
          <ProtectedRoute permission="MI-AGENDA">
            <Agenda />
          </ProtectedRoute>
        }
      />
      <Route
        path="/backlog"
        element={
          <ProtectedRoute permission="BACKLOG">
            <BackLog />
          </ProtectedRoute>
        }
      />
      <Route
        path="/backlog/error/:idCaseTest"
        element={
          <ProtectedRoute permission="BACKLOG">
            <ViewError />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tablero"
        element={
          <ProtectedRoute permission="MI-TABLERO">
            <Board />
          </ProtectedRoute>
        }
      />
      <Route
        path="/estadisticas"
        element={
          <ProtectedRoute permission="ESTADISTICAS">
            <Estadistics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lineas"
        element={
          <ProtectedRoute permission="LINEAS-DESARROLLO">
            <Lineas />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lineas/:idLine"
        element={
          <ProtectedRoute permission="LINEAS-DESARROLLO">
            <LineDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/proyectos"
        element={
          <ProtectedRoute permission="PROYECTOS">
            <Project />
          </ProtectedRoute>
        }
      />
      <Route
        path="/roles"
        element={
          <ProtectedRoute permission="ROLES">
            <Role />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pruebas"
        element={
          <ProtectedRoute permission="PRUEBAS">
            <Test />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pruebas/registrarcaso"
        element={
          <ProtectedRoute permission="PRUEBAS">
            <CaseTest />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pruebas/caso/:idCaseTest"
        element={
          <ProtectedRoute permission="PRUEBAS">
            <ViewTest />
          </ProtectedRoute>
        }
      />
      <Route
        path="/usuarios"
        element={
          <ProtectedRoute permission="USUARIOS">
            <User />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
