import { useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";

export const RegisterTask = ({
  resetData,
  notification,
  url,
  token,
  projectsCharged,
  projects,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [projectSelected, setProjectSelected] = useState(0);
  const [stateSelected, setStateSelected] = useState(1);

  const onSubmit = async (data) => {
    try {
      data.id_proyecto = projectSelected;
      data.id_estado = stateSelected;

      notification.info("Registrando Usuario");
      setIsLoading(true);
      const response = await fetch(`${url}/tareas/`, {
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
      document.getElementById("modal_add_task").close();
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

  const states = [
    { value: 1, label: "EN PROGRESO" },
    { value: 2, label: "EN CURSO" },
    { value: 1, label: "TERMINADA" },
  ];

  return (
    <>
      <button
        className="btn btn-success"
        onClick={() => document.getElementById("modal_add_task").showModal()}
      >
        Nueva Tarea
      </button>
      <dialog id="modal_add_task" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Creando una tarea!</h3>
          <p className="">Ingrese los datos de la tarea</p>
          <div className="w-full">
            <form
              method="dialog"
              className="flex flex-col gap-y-2 mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <p>Seleccione un proyecto</p>
              <div className="w-full">
                <Select
                  options={projects}
                  onChange={(selectedOption) =>
                    setProjectSelected(selectedOption.value)
                  }
                />
              </div>
              <label
                className={`input input-bordered ${
                  errors.nombre_tarea ? "input-error" : ""
                } flex items-center gap-2`}
              >
                Nombre tarea:
                <input
                  type="text"
                  className="grow"
                  {...register("nombre_tarea", {
                    maxLength: 50,
                    minLength: 5,
                    required: true,
                  })}
                />
              </label>
              {errors.nombre_tarea && (
                <p role="alert" className="mt-1 text-sm text-red-700">
                  Nombre requerido, minimo 5 caracteres maximo 50
                </p>
              )}
              <label
                className={`input input-bordered ${
                  errors.descripcion_tarea ? "input-error" : ""
                } flex items-center gap-2`}
              >
                Descripción:
                <input
                  type="text"
                  className="grow"
                  {...register("descripcion_tarea", {
                    maxLength: 200,
                    minLength: 5,
                    required: true,
                  })}
                />
              </label>
              {errors.descripcion_tarea && (
                <p role="alert" className="mt-1 text-sm text-red-700">
                  Descripción requerida, minimo 5 caracteres maximo 200
                </p>
              )}
              <div className="w-full">
                <p>Estado</p>
                <Select
                  options={states}
                  defaultValue={states[0]}
                  onChange={(selectedOption) =>
                    setStateSelected(selectedOption.value)
                  }
                />
              </div>
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
                  errors.fecha_finalizacion ? "input-error" : ""
                } flex items-center gap-2`}
              >
                Fecha finalización:
                <input
                  type="date"
                  className="grow"
                  {...register("fecha_finalizacion", {
                    required: true,
                  })}
                />
              </label>
              {errors.fecha_finalizacion && (
                <p role="alert" className="mt-1 text-sm text-red-700">
                  Fecha de finalización obligatoria
                </p>
              )}
              <div className="w-full flex flex-row-reverse gap-x-4">
                <button
                  className="btn btn-outline btn-error"
                  type="button"
                  onClick={() =>
                    document.getElementById("modal_add_task").close()
                  }
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={
                    isLoading || !projectsCharged || projectSelected === 0
                  }
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

export const EditTask = ({
  resetData,
  notification,
  url,
  token,
  projectsCharged,
  projects,
  idTask,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [projectSelected, setProjectSelected] = useState(0);
  const [stateSelected, setStateSelected] = useState(1);

  const onSubmit = async (data) => {
    try {
      data.id_tarea = idTask;
      data.id_proyecto = projectSelected;
      data.id_estado = stateSelected;

      notification.info("Registrando Usuario");
      setIsLoading(true);
      const response = await fetch(`${url}/tareas/`, {
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
      document.getElementById(`modal_edit_task_${idTask}`).close();
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

  const states = [
    { value: 1, label: "EN PROGRESO" },
    { value: 2, label: "EN CURSO" },
    { value: 1, label: "TERMINADA" },
  ];

  const getTask = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${url}/tareas/unica?id=${idTask}`, {
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
          "Algo salió mal, al buscar la tarea comuníquese con soporte";
        notification.error(message);
        return;
      }

      setValue("nombre_tarea", jsonResponse.data.nombre_tarea);
      setValue("descripcion_tarea", jsonResponse.data.descripcion_tarea);
      setValue("fecha_inicio", jsonResponse.data.fecha_inicio);
      setValue("fecha_finalizacion", jsonResponse.data.fecha_finalizacion);
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
    document.getElementById(`modal_edit_task_${idTask}`).showModal();
    getTask();
  };

  return (
    <>
      <button className="btn btn-xs" onClick={openModal}>
        Editar
      </button>
      <dialog id={`modal_edit_task_${idTask}`} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Actualizando tarea!</h3>
          <p className="">Datos de la tarea</p>
          <div className="w-full">
            <form
              method="dialog"
              className="flex flex-col gap-y-2 mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="w-full">
                <p>Proyecto</p>
                <Select
                  options={projects}
                  onChange={(selectedOption) =>
                    setProjectSelected(selectedOption.value)
                  }
                />
              </div>
              <label
                className={`input input-bordered ${
                  errors.nombre_tarea ? "input-error" : ""
                } flex items-center gap-2`}
              >
                Nombre tarea:
                <input
                  type="text"
                  className="grow"
                  {...register("nombre_tarea", {
                    maxLength: 50,
                    minLength: 5,
                    required: true,
                  })}
                />
              </label>
              {errors.nombre_tarea && (
                <p role="alert" className="mt-1 text-sm text-red-700">
                  Nombre requerido, minimo 5 caracteres maximo 50
                </p>
              )}
              <label
                className={`input input-bordered ${
                  errors.descripcion_tarea ? "input-error" : ""
                } flex items-center gap-2`}
              >
                Descripción:
                <input
                  type="text"
                  className="grow"
                  {...register("descripcion_tarea", {
                    maxLength: 200,
                    minLength: 5,
                    required: true,
                  })}
                />
              </label>
              {errors.descripcion_tarea && (
                <p role="alert" className="mt-1 text-sm text-red-700">
                  Descripción requerida, minimo 5 caracteres maximo 200
                </p>
              )}
              <div className="w-full">
                <p>Estado</p>
                <Select
                  options={states}
                  defaultValue={states[0]}
                  onChange={(selectedOption) =>
                    setStateSelected(selectedOption.value)
                  }
                />
              </div>
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
                  errors.fecha_finalizacion ? "input-error" : ""
                } flex items-center gap-2`}
              >
                Fecha finalización:
                <input
                  type="date"
                  className="grow"
                  {...register("fecha_finalizacion", {
                    required: true,
                  })}
                />
              </label>
              {errors.fecha_finalizacion && (
                <p role="alert" className="mt-1 text-sm text-red-700">
                  Fecha de finalización obligatoria
                </p>
              )}
              <div className="w-full flex flex-row-reverse gap-x-4">
                <button
                  className="btn btn-outline btn-error"
                  type="button"
                  onClick={() =>
                    document.getElementById(`modal_edit_task_${idTask}`).close()
                  }
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={
                    isLoading || !projectsCharged || projectSelected === 0
                  }
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

export const DeleteTask = ({
  resetData,
  notification,
  url,
  token,
  idTask,
  nameTask,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const response = await fetch(`${url}/tareas/?id=${idTask}`, {
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
      document.getElementById(`modal_delete_task_${idTask}`).close();
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
          document.getElementById(`modal_delete_task_${idTask}`).showModal()
        }
      >
        Eliminar
      </button>
      <dialog id={`modal_delete_task_${idTask}`} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Eliminando tarea!</h3>
          <p className="">¿Esta seguro de eliminar la tarea?</p>
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
                <span>{`Esta seguro de eliminar la tarea: ${nameTask}`}</span>
              </div>
              <div className="w-full flex flex-row-reverse gap-x-4">
                <button
                  className="btn"
                  type="button"
                  onClick={() =>
                    document
                      .getElementById(`modal_delete_task_${idTask}`)
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

export const RegisterHour = ({
  resetData,
  notification,
  url,
  token,
  projectsCharged,
  projects,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [projectSelected, setProjectSelected] = useState(0);

  const onSubmit = async (data) => {
    try {
      data.id_proyecto = projectSelected;
      data.horas_trabajadas = parseFloat(data.horas_trabajadas);

      setIsLoading(true);
      const response = await fetch(`${url}/tareas/hora`, {
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
      document.getElementById("modal_add_hour").close();
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

  return (
    <>
      <button
        className="btn btn-info btn-outline"
        onClick={() => document.getElementById("modal_add_hour").showModal()}
      >
        Registra tiempo
      </button>
      <dialog id="modal_add_hour" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Registrando tiempo!</h3>
          <p className="">Ingrese los datos de la hora trabajada</p>
          <div className="w-full">
            <form
              method="dialog"
              className="flex flex-col gap-y-2 mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <p className="text-base">Seleccione el proyecto</p>
              <div className="w-full">
                <Select
                  options={projects}
                  onChange={(selectedOption) =>
                    setProjectSelected(selectedOption.value)
                  }
                />
              </div>
              <label
                className={`input input-bordered ${
                  errors.horas_trabajadas ? "input-error" : ""
                } flex items-center gap-2`}
              >
                Horas trabajadas:
                <input
                  type="number"
                  className="grow"
                  {...register("horas_trabajadas", {
                    min: 0,
                    required: true,
                  })}
                />
              </label>
              {errors.horas_trabajadas && (
                <p role="alert" className="mt-1 text-sm text-red-700">
                  Horas obligatorias, no puede ingresar datos negativos
                </p>
              )}
              <label
                className={`input input-bordered ${
                  errors.fecha_trabajada ? "input-error" : ""
                } flex items-center gap-2`}
              >
                Fecha trabajada:
                <input
                  type="date"
                  className="grow"
                  {...register("fecha_trabajada", {
                    required: true,
                  })}
                />
              </label>
              {errors.fecha_trabajada && (
                <p role="alert" className="mt-1 text-sm text-red-700">
                  Fecha de trabajada obligatoria
                </p>
              )}
              <div className="w-full flex flex-row-reverse gap-x-4">
                <button
                  className="btn btn-outline btn-error"
                  type="button"
                  onClick={() =>
                    document.getElementById("modal_add_hour").close()
                  }
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={
                    isLoading || !projectsCharged || projectSelected === 0
                  }
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
