import { useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";

export const RegisterProject = ({ resetData, notification, url, token }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [linesCharged, setLinesCharged] = useState(false);
  const [lines, setLines] = useState([]);
  const [lineSelected, setLineSelected] = useState(0);

  const onSubmit = async (data) => {
    try {
      data.id_linea = lineSelected.value;
      data.costo_estimado = parseFloat(data.costo_estimado);

      notification.info("Registrando Proyecto");
      setIsLoading(true);
      const response = await fetch(`${url}/proyectos/`, {
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
      document.getElementById("modal_add_project").close();
      reset();
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

  const getLines = async () => {
    try {
      notification.info("Obtenido Lineas de desarrollo");
      setIsLoading(true);
      const response = await fetch(`${url}/lineas/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const jsonResponse = await response.json();
      if (!response.ok) {
        console.log(jsonResponse.message);
        const message = "No se pudieron cargar las lineas de desarrollo";
        notification.error(message);
        return;
      }

      notification.success(jsonResponse.message);

      const dataLines = jsonResponse.data.map((line) => ({
        value: line.id_linea,
        label: line.linea,
      }));

      setLines(dataLines);
      setLinesCharged(true);
    } catch (error) {
      console.log(error);
      notification.error(
        "Ocurrió un problema inesperado, comuníquese con soporte"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = () => {
    document.getElementById("modal_add_project").showModal();
    getLines();
  };

  return (
    <>
      <button className="btn btn-success" onClick={openModal}>
        Nuevo Proyecto
      </button>
      <dialog id="modal_add_project" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Registrar Projecto!</h3>
          <p className="">Ingrese los datos del proyecto</p>
          <div className="w-full">
            <form
              method="dialog"
              className="flex flex-col gap-y-2 mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <label
                className={`input input-bordered ${
                  errors.nombre ? "input-error" : ""
                } flex items-center gap-2`}
              >
                Nombre:
                <input
                  type="text"
                  className="grow"
                  {...register("nombre", {
                    maxLength: 75,
                    minLength: 3,
                    required: true,
                  })}
                />
              </label>
              {errors.nombre && (
                <p role="alert" className="mt-1 text-sm text-red-700">
                  Nombre requerido, minimo 3 caracteres maximo 75
                </p>
              )}
              <label
                className={`input input-bordered ${
                  errors.descripcion ? "input-error" : ""
                } flex items-center gap-2`}
              >
                Descripcion:
                <input
                  type="text"
                  className="grow"
                  {...register("descripcion", {
                    maxLength: 200,
                    minLength: 5,
                    required: true,
                  })}
                />
              </label>
              {errors.descripcion && (
                <p role="alert" className="mt-1 text-sm text-red-700">
                  Descripcion requerido, minimo 5 caracteres maximo 200
                </p>
              )}
              <p className="label-text">Seleccione la linea de desarrollo</p>
              <div className="w-full">
                <Select
                  options={lines}
                  onChange={(selectedOption) => setLineSelected(selectedOption)}
                />
              </div>
              <label
                className={`input input-bordered ${
                  errors.costo_estimado ? "input-error" : ""
                } flex items-center gap-2`}
              >
                Costo estimado:
                <input
                  type="number"
                  className="grow"
                  {...register("costo_estimado", {
                    min: 0,
                    required: true,
                  })}
                />
              </label>
              {errors.costo_estimado && (
                <p role="alert" className="mt-1 text-sm text-red-700">
                  El costo estimado es obligatorio, minimo 0
                </p>
              )}
              <label
                className={`input input-bordered ${
                  errors.fecha_inicio ? "input-error" : ""
                } flex items-center gap-2`}
              >
                Fecha inicio:
                <input
                  type="date"
                  className="grow"
                  {...register("fecha_inicio", {
                    required: true,
                  })}
                />
              </label>
              {errors.fecha_inicio && (
                <p role="alert" className="mt-1 text-sm text-red-700">
                  Fecha de inicio obligatoria
                </p>
              )}
              <label
                className={`input input-bordered ${
                  errors.fecha_final ? "input-error" : ""
                } flex items-center gap-2`}
              >
                Fecha finalizacion:
                <input
                  type="date"
                  className="grow"
                  {...register("fecha_final", {
                    required: true,
                  })}
                />
              </label>
              {errors.fecha_final && (
                <p role="alert" className="mt-1 text-sm text-red-700">
                  Fecha de finalizacion obligatoria
                </p>
              )}
              <div className="form-control w-full">
                <label className="label cursor-pointer">
                  <span className="label-text">Esta activo:</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-success"
                    defaultChecked
                    {...register("activo")}
                  />
                </label>
              </div>
              <div className="w-full flex flex-row-reverse gap-x-4">
                <button
                  className="btn btn-outline btn-error"
                  type="button"
                  onClick={() =>
                    document.getElementById("modal_add_project").close()
                  }
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={isLoading || !linesCharged || lineSelected === 0}
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

export const EditProject = ({
  resetData,
  notification,
  url,
  token,
  idProject,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [linesCharged, setLinesCharged] = useState(false);
  const [lines, setLines] = useState([]);
  const [lineSelected, setLineSelected] = useState(0);

  const onSubmit = async (data) => {
    try {
      data.id_proyecto = idProject;
      data.id_linea = lineSelected.value;
      data.costo_estimado = parseFloat(data.costo_estimado);

      notification.info("Registrando Usuario");
      setIsLoading(true);
      const response = await fetch(`${url}/proyectos/`, {
        method: "PUT",
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
      document.getElementById(`modal_edit_project_${idProject}`).close();
      reset();
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

  const getLines = async () => {
    try {
      notification.info("Obtenido Lineas de desarrollo");
      setIsLoading(true);
      const response = await fetch(`${url}/lineas/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const jsonResponse = await response.json();
      if (!response.ok) {
        console.log(jsonResponse.message);
        const message = "No se pudieron cargar las lineas de desarrollo";
        notification.error(message);
        return;
      }

      notification.success(jsonResponse.message);

      const dataLines = jsonResponse.data.map((line) => ({
        value: line.id_linea,
        label: line.linea,
      }));

      setLines(dataLines);
      setLinesCharged(true);
    } catch (error) {
      console.log(error);
      notification.error(
        "Ocurrió un problema inesperado, comuníquese con soporte"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getProject = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${url}/proyectos/${idProject}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const jsonResponse = await response.json();
      if (!response.ok) {
        console.log(jsonResponse.message);
        const message =
          "Algo salió mal, al buscar al usuario comuníquese con soporte";
        notification.error(message);
        return;
      }

      setValue("nombre", jsonResponse.data.nombre);
      setValue("descripcion", jsonResponse.data.descripcion);
      setValue("costo_estimado", jsonResponse.data.costo_estimado);
      setValue("fecha_inicio", jsonResponse.data.fecha_inicio);
      setValue("fecha_final", jsonResponse.data.fecha_final);
      setValue("activo", jsonResponse.data.activo);
    } catch (error) {
      console.log(error);
      notification.error(
        "Ocurrió un problema inesperado, comuníquese con soporte"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = () => {
    document.getElementById(`modal_edit_project_${idProject}`).showModal();
    getLines();
    getProject();
  };

  return (
    <>
      <button className="btn btn-xs" onClick={openModal}>
        Editar
      </button>
      <dialog id={`modal_edit_project_${idProject}`} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Actualizando proyecto!</h3>
          <p className="">Datos del proyecto:</p>
          <div className="w-full">
            <form
              method="dialog"
              className="flex flex-col gap-y-2 mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <label
                className={`input input-bordered ${
                  errors.nombre ? "input-error" : ""
                } flex items-center gap-2`}
              >
                Nombre:
                <input
                  type="text"
                  className="grow"
                  {...register("nombre", {
                    maxLength: 75,
                    minLength: 3,
                    required: true,
                  })}
                />
              </label>
              {errors.nombre && (
                <p role="alert" className="mt-1 text-sm text-red-700">
                  Nombre requerido, minimo 3 caracteres maximo 75
                </p>
              )}
              <label
                className={`input input-bordered ${
                  errors.descripcion ? "input-error" : ""
                } flex items-center gap-2`}
              >
                Descripcion:
                <input
                  type="text"
                  className="grow"
                  {...register("descripcion", {
                    maxLength: 200,
                    minLength: 5,
                    required: true,
                  })}
                />
              </label>
              {errors.descripcion && (
                <p role="alert" className="mt-1 text-sm text-red-700">
                  Descripcion requerido, minimo 5 caracteres maximo 200
                </p>
              )}
              <p className="label-text">Seleccione la linea de desarrollo</p>
              <div className="w-full">
                <Select
                  options={lines}
                  onChange={(selectedOption) => setLineSelected(selectedOption)}
                />
              </div>
              <label
                className={`input input-bordered ${
                  errors.costo_estimado ? "input-error" : ""
                } flex items-center gap-2`}
              >
                Costo estimado:
                <input
                  type="number"
                  className="grow"
                  {...register("costo_estimado", {
                    min: 0,
                    required: true,
                  })}
                />
              </label>
              {errors.costo_estimado && (
                <p role="alert" className="mt-1 text-sm text-red-700">
                  El costo estimado es obligatorio, minimo 0
                </p>
              )}
              <label
                className={`input input-bordered ${
                  errors.fecha_inicio ? "input-error" : ""
                } flex items-center gap-2`}
              >
                Fecha inicio:
                <input
                  type="date"
                  className="grow"
                  {...register("fecha_inicio", {
                    required: true,
                  })}
                />
              </label>
              {errors.fecha_inicio && (
                <p role="alert" className="mt-1 text-sm text-red-700">
                  Fecha de inicio obligatoria
                </p>
              )}
              <label
                className={`input input-bordered ${
                  errors.fecha_final ? "input-error" : ""
                } flex items-center gap-2`}
              >
                Fecha finalizacion:
                <input
                  type="date"
                  className="grow"
                  {...register("fecha_final", {
                    required: true,
                  })}
                />
              </label>
              {errors.fecha_final && (
                <p role="alert" className="mt-1 text-sm text-red-700">
                  Fecha de finalizacion obligatoria
                </p>
              )}
              <div className="form-control w-full">
                <label className="label cursor-pointer">
                  <span className="label-text">Esta activo:</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-success"
                    {...register("activo")}
                  />
                </label>
              </div>
              <div className="w-full flex flex-row-reverse gap-x-4">
                <button
                  className="btn btn-outline btn-error"
                  type="button"
                  onClick={() =>
                    document
                      .getElementById(`modal_edit_project_${idProject}`)
                      .close()
                  }
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={isLoading || !linesCharged || lineSelected === 0}
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

export const DeleteProject = ({
  resetData,
  notification,
  url,
  token,
  idProject,
  nameProject,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const response = await fetch(`${url}/proyectos/?id=${idProject}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const jsonResponse = await response.json();
      if (!response.ok) {
        console.log(jsonResponse.message);
        const message = "Algo salió mal, comuníquese con soporte";
        notification.error(message);
        return;
      }

      notification.success(jsonResponse.message);
      document.getElementById(`modal_delete_project_${idProject}`).close();
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

  return (
    <>
      <button
        className="btn btn-error btn-outline btn-xs"
        onClick={() =>
          document.getElementById(`modal_delete_project_${idProject}`).showModal()
        }
      >
        Eliminar
      </button>
      <dialog id={`modal_delete_project_${idProject}`} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Eliminando proyecto!</h3>
          <p className="">¿Esta seguro de eliminar el proyecto?</p>
          <div className="w-full">
            <form
              method="dialog"
              className="flex flex-col gap-y-2 mt-2"
              onSubmit={onSubmit}
            >
              <div role="alert" className="alert alert-error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{`Esta apunto de eliminar el proyecto: ${nameProject}`}</span>
              </div>
              <div className="w-full flex flex-row-reverse gap-x-4">
                <button
                  className="btn"
                  type="button"
                  onClick={() =>
                    document
                      .getElementById(`modal_delete_project_${idProject}`)
                      .close()
                  }
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-error btn-outline"
                  disabled={isLoading}
                >
                  ELIMINAR{" "}
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
