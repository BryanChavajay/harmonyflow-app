import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useStoreAuth } from "../stores/GlobalAuth.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import { Login } from "./login/page.jsx";
import { Agenda } from "./agenda/page.jsx";
import { BackLog } from "./backlog/page.jsx";
import { Board } from "./board/Page.jsx";
import { Estadistics } from "./estadistics/Page.jsx";
import { Lineas } from "./lines/Page.jsx";
import { Project } from "./project/Page.jsx";
import { Role } from "./role/Page.jsx";
import { Test } from "./test/Page.jsx";
import { User } from "./user/User.jsx";

export const AppRouter = () => {
  const navigate = useNavigate();

  const URL = import.meta.env.VITE_API_URL;

  const { resetAuth, setAuth } = useStoreAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Si no hay token, redirige al inicio de sesión
    if (!token) {
      resetAuth();
      navigate("/");
      return;
    }

    // Si hay token, verifica su validez con la API
    const verifyToken = async () => {
      try {
        const response = await fetch(`${URL}/usuarios/verificar`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        // Si la respuesta no es exitosa, maneja el error
        const jsonResponse = await response.json();
        if (!response.ok) {
          console.log(
            jsonResponse.message || "Algo salió mal, comuníquese con soporte"
          );
          localStorage.removeItem("token");
          resetAuth();
          navigate("/");
          return;
        }
        setAuth(jsonResponse.usuario.permisos, jsonResponse.usuario.usuario);
      } catch (error) {
        console.log("Error al verificar el token:", error);
        localStorage.removeItem("token");
        navigate("/");
        resetAuth();
      }
    };

    verifyToken();
  }, [URL]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route
          path="/agenda"
          element={
            <ProtectedRoute redirect="/agenda" permission="MI-AGENDA">
              <Agenda />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/backlog"
          element={
            <ProtectedRoute redirect="/agenda" permission="BACKLOG">
              <BackLog />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/tablero"
          element={
            <ProtectedRoute redirect="/agenda" permission="MI-TABLERO">
              <Board />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/estadisticas"
          element={
            <ProtectedRoute redirect="/agenda" permission="ESTADISTICAS">
              <Estadistics />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/lineas"
          element={
            <ProtectedRoute redirect="/agenda" permission="LINEAS-DESARROLLO">
              <Lineas />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/proyectos"
          element={
            <ProtectedRoute redirect="/agenda" permission="PROYECTOS">
              <Project />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/roles"
          element={
            <ProtectedRoute redirect="/agenda" permission="ROLES">
              <Role />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/pruebas"
          element={
            <ProtectedRoute redirect="/agenda" permission="PRUEBAS">
              <Test />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute redirect="/agenda" permission="USUARIOS">
              <User />
            </ProtectedRoute>
          }
        ></Route>
      </Routes>
    </>
  );
};
