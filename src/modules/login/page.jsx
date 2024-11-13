import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useStoreAuth } from "../../stores/GlobalAuth.jsx";
import { useNavigate } from "react-router-dom";

const Error = ({ message }) => {
  return (
    <p role="alert" className="mt-1 text-sm text-red-700">
      {message}
    </p>
  );
};

export const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  const setAuth = useStoreAuth((state) => state.setAuth);
  const resetAuth = useStoreAuth((state) => state.resetAuth);

  const URL = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${URL}/auth/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const jsonResponse = await response.json();

      if (!response.ok) {
        return console.log(
          jsonResponse.message || "Algo salio mal, comuniquece con soporte"
        );
      }

      const response2 = await fetch(`${URL}/usuarios/verificar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jsonResponse.data.token}`,
        },
      });

      const jsonResponse2 = await response2.json();

      if (!response2.ok) {
        return console.log(
          jsonResponse2.message || "Algo salio mal, comuniquece con soporte"
        );
      }

      localStorage.setItem("token", jsonResponse.data.token);
      setAuth(jsonResponse2.usuario.permisos, jsonResponse2.usuario.usuario);
      navigate("/agenda");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Si no hay token, resetea el estado global
    if (!token) {
      resetAuth();
      return;
    }

    navigate("/agenda");
  }, [URL]);

  return (
    <div className="flex min-h-screen bg-white">
      {/* Logo section */}
      <section className="hidden w-1/2 bg-cyan-700/95 lg:block">
        <div className="flex h-full items-center justify-center">
          <p>Recordar colocar el logo Aca</p>
        </div>
      </section>

      {/* Form section */}
      <section className="flex w-full items-center justify-center lg:w-1/2">
        <div className="max-w-md space-y-8 px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Iniciar sesión
            </h1>
            <p className="text-sm text-gray-500">
              Ingrese sus credenciales para acceder a su cuenta
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  className={`input input-bordered ${
                    errors.username ? "input-error" : ""
                  } flex items-center gap-2`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className={`h-4 w-4 opacity-70 ${
                      errors.username ? "text-red-700" : "text-gray-500"
                    }`}
                  >
                    <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                    <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                  </svg>
                  <input
                    type="email"
                    className="grow"
                    placeholder="Correo o usuario"
                    {...register("username", { required: true, maxLength: 50 })}
                    aria-invalid={errors.username ? "true" : "false"}
                  />
                </label>
                {errors.username && (
                  <Error message="Correo o usuario requerido, maximo 50 caracteres" />
                )}
              </div>
              <div>
                <label
                  className={`input input-bordered ${
                    errors.password ? "input-error" : ""
                  } flex items-center gap-2`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className={`h-4 w-4 opacity-70 ${
                      errors.password ? "text-red-700" : "text-gray-500"
                    }`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    type="password"
                    className="grow"
                    placeholder="Contraseña"
                    {...register("password", { required: true, maxLength: 50 })}
                    aria-invalid={errors.password ? "true" : "false"}
                  />
                </label>
                {errors.password && (
                  <Error message="Contraseña requerida, maximo 50 caracteres" />
                )}
              </div>
            </div>
            <div>
              <button
                className="w-full bg-cyan-600 hover:bg-cyan-700 rounded-lg px-4 py-2 text-white"
                disabled={isLoading}
              >
                Iniciar sesión{" "}
                {isLoading && (
                  <span className="loading loading-spinner loading-xs"></span>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};
