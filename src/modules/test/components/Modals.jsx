import { useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select/async";

export const RegisterError = ({
  resetData,
  notification,
  url,
  token,
  idCaseTest,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userSelected, setUserSelected] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      data.id_caso_prueba = parseInt(idCaseTest);
      data.id_usuario_asignado = userSelected;

      const response = await fetch(`${url}/pruebas/error`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const jsonResponse = await response.json();
      if (!response.ok) {
        console.log(jsonResponse.message);
        const message = "Algo salió mal, comuníquese con soporte";
        notification.error(message);
        return;
      }

      notification.success(jsonResponse.message);
      document.getElementById("modal_add_error").close();
      resetData();
    } catch (error) {
      console.log(error);
      notification.error(
        "Ocurrio un problema inesperado, comuniquese con soporte"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loadOptions = async (searchValue, callback) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${url}/usuarios/buscarnombre?nombre=${searchValue}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const jsonResponse = await response.json();
      if (!response.ok) {
        console.log(jsonResponse.message);
        const message = "No se encontro al recurso";
        notification.error(message);
        callback([]);
        return;
      }

      const options = jsonResponse.data.map((option) => ({
        label: option.nombre,
        value: option.codigo_usuario,
      }));
      callback(options);
    } catch (error) {
      console.log(error);
      notification.error(
        "Ocurrió un problema inesperado, comuníquese con soporte"
      );
      callback([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        className="btn btn-error btn-sm btn-outline"
        onClick={() => document.getElementById("modal_add_error").showModal()}
      >
        Registrar error
      </button>
      <dialog id="modal_add_error" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">REGISTRAR ERROR</h3>
          <p className="">Ingrese los datos para registrar un error</p>
          <div className="w-full">
            <form
              method="dialog"
              className="flex flex-col gap-y-2 mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <p className="label-text">Asignar error al usuario:</p>
              <div className="w-full">
                <Select
                  loadOptions={loadOptions}
                  onChange={(selectedOption) =>
                    setUserSelected(selectedOption.value)
                  }
                />
              </div>
              <label
                className={`input input-bordered ${
                  errors.descripcion ? "input-error" : ""
                } flex items-center gap-2`}
              >
                Descripción:
                <input
                  type="text"
                  className="grow"
                  {...register("descripcion", {
                    maxLength: 200,
                    required: true,
                  })}
                />
              </label>
              {errors.descripcion && (
                <p role="alert" className="mt-1 text-sm text-red-700">
                  Descripción requerida, máximo 250 caracteres
                </p>
              )}
              <label
                className={`input input-bordered ${
                  errors.fecha_reporte ? "input-error" : ""
                } flex items-center gap-2`}
              >
                Fecha reporte:
                <input
                  type="date"
                  className="grow"
                  {...register("fecha_reporte", {
                    required: true,
                  })}
                />
              </label>
              {errors.fecha_reporte && (
                <p role="alert" className="mt-1 text-sm text-red-700">
                  Fecha requerida
                </p>
              )}
              <div className="w-full flex flex-row-reverse gap-x-4">
                <button
                  className="btn btn-outline btn-error"
                  type="button"
                  onClick={() =>
                    document.getElementById("modal_add_error").close()
                  }
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={isLoading || userSelected === 0}
                >
                  Registrar{" "}
                  {isLoading && (
                    <span className="loading loading-spinner loading-xs"></span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export const ExecuteTest = ({
  resetData,
  notification,
  url,
  token,
  idCaseTest,
  campsTest,
  expectedState = 200,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [execute, setExecute] = useState(false);
  const [successfullTest, setSuccessfullTest] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  function transformToBody(arr) {
    const resultado = {};

    arr.forEach((item) => {
      resultado[item.nombre_campo] = item.contenido;
    });

    return resultado;
  }

  const onSubmit = async (data) => {
    let response;
    let resultDat = "";

    try {
      setIsLoading(true);

      if (data.request_type == 1) {
        response = await fetch(data.url_request, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log("Haciendo una petición GET a: ", data.url_request);
      } else {
        const contentRequest = transformToBody(campsTest);
        response = await fetch(data.url_request, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(contentRequest),
        });
        // console.log("Haciendo una petición GET a: ", data.url_request);
        // console.log(contentRequest);
      }

      let requestResult = parseInt(response.status) === parseInt(expectedState);
      if (requestResult) {
        setSuccessfullTest(true);
      }
      setExecute(true);
      resultDat = await response.text();

      const bodyUpdate = {
        id_prueba_automatizada: parseInt(idCaseTest),
        cuerpo_devuelto: resultDat,
        estado_devuelto: parseInt(response.status),
        correcto: requestResult,
      };

      const response2 = await fetch(`${url}/pruebas/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyUpdate),
      });

      const jsonResponse = await response2.json();
      if (!response2.ok) {
        console.log(jsonResponse.message);
        const message = "Algo salió mal, comuníquese con soporte";
        notification.error(message);
        return;
      }

      notification.success(jsonResponse.message);
      resetData();
    } catch (error) {
      console.log(error);
      notification.error(
        "Ocurrio un problema inesperado, comuniquese con soporte"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const requestOptions = [
    { value: 1, label: "GET" },
    { value: 2, label: "POST" },
  ];

  return (
    <>
      <button
        className="btn btn-accent btn-sm"
        onClick={() =>
          document.getElementById("modal_add_execute_test").showModal()
        }
      >
        EJECUTAR
      </button>
      <dialog id="modal_add_execute_test" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg">REGISTRAR ERROR</h3>
          <p className="">Ingrese los datos para registrar un error</p>
          <div className="w-full">
            <form
              method="dialog"
              className="flex flex-col gap-y-2 mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="w-60">
                <label className="block text-base text-gray-700">
                  Seleccione el tipo de petición
                </label>
                <select
                  {...register(`request_type`, {
                    required: true,
                  })}
                  className={`w-full select select-bordered ${
                    errors?.request_type ? "select-error" : ""
                  }`}
                >
                  {requestOptions.map((dato, index) => (
                    <option key={index} value={dato.value}>
                      {dato.label}
                    </option>
                  ))}
                </select>
                {errors?.request_type && (
                  <p className="text-sm text-red-700">
                    Debe seleccionar un proyecto
                  </p>
                )}
              </div>
              <label
                className={`input input-bordered ${
                  errors.url_request ? "input-error" : ""
                } flex items-center gap-2`}
              >
                URL de la petición:
                <input
                  type="text"
                  className="grow"
                  {...register("url_request", {
                    required: true,
                  })}
                />
              </label>
              {errors.url_request && (
                <p role="alert" className="mt-1 text-sm text-red-700">
                  La URL es obligatoria
                </p>
              )}
              {isLoading && (
                <p>
                  Ejecutando{" "}
                  <span className="loading loading-dots loading-lg"></span>
                </p>
              )}

              {execute &&
                (successfullTest ? (
                  <div role="alert" className="alert alert-success">
                    <span>El test fue exitoso!</span>
                  </div>
                ) : (
                  <div role="alert" className="alert alert-error">
                    <span>El test ha fallado!</span>
                  </div>
                ))}

              <div className="w-full flex flex-row-reverse gap-x-4">
                <button
                  className="btn btn-outline btn-neutral"
                  type="button"
                  onClick={() =>
                    document.getElementById("modal_add_execute_test").close()
                  }
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={isLoading}
                >
                  EJECUTAR{" "}
                  {isLoading && (
                    <span className="loading loading-spinner loading-xs"></span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};
