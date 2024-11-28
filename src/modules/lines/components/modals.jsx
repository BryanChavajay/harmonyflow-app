import { useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select/async";

export const RegisterLine = ({ resetData, notification, url, token }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      notification.info("Registrando Linea de desarrollo");
      setIsLoading(true);
      const response = await fetch(`${url}/lineas/`, {
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
      document.getElementById("modal_add_line").close();
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
        className="btn btn-success"
        onClick={() => document.getElementById("modal_add_line").showModal()}
      >
        Nueva Linea
      </button>
      <dialog id="modal_add_line" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Registrar Linea de Desarrollo!</h3>
          <p className="">Ingrese los datos de la linea</p>
          <div className="w-full">
            <form
              method="dialog"
              className="flex flex-col gap-y-2 mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <label
                className={`input input-bordered ${
                  errors.linea ? "input-error" : ""
                } flex items-center gap-2`}
              >
                Nombre de la linea:
                <input
                  type="text"
                  className="grow"
                  {...register("linea", {
                    maxLength: 45,
                    minLength: 3,
                    required: true,
                  })}
                />
              </label>
              {errors.linea && (
                <p role="alert" className="mt-1 text-sm text-red-700">
                  Nombre requerido, minimo 3 caracteres maximo 45
                </p>
              )}
              <div className="w-full flex flex-row-reverse gap-x-4">
                <button
                  className="btn btn-outline btn-error"
                  type="button"
                  onClick={() =>
                    document.getElementById("modal_add_line").close()
                  }
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={isLoading}
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

export const EditLine = ({ resetData, notification, url, token, idLine }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      data.id_linea = idLine;

      notification.info("Modificando Linea");
      setIsLoading(true);

      const response = await fetch(`${url}/lineas/`, {
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
      document.getElementById(`modal_edit_line_${idLine}`).close();
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

  const getLine = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${url}/lineas/${idLine}`, {
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
          "Algo salió mal, al buscar la linea comuníquese con soporte";
        notification.error(message);
        return;
      }

      setValue("linea", jsonResponse.data.linea);
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
    document.getElementById(`modal_edit_line_${idLine}`).showModal();
    getLine();
  };

  return (
    <>
      <button className="btn btn-xs" onClick={openModal}>
        Editar
      </button>
      <dialog id={`modal_edit_line_${idLine}`} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Registrar Usuario!</h3>
          <p className="">Ingrese los datos del usuario</p>
          <div className="w-full">
            <form
              method="dialog"
              className="flex flex-col gap-y-2 mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <label
                className={`input input-bordered ${
                  errors.linea ? "input-error" : ""
                } flex items-center gap-2`}
              >
                Nombre de la linea:
                <input
                  type="text"
                  className="grow"
                  {...register("linea", {
                    maxLength: 45,
                    minLength: 3,
                    required: true,
                  })}
                />
              </label>
              {errors.linea && (
                <p role="alert" className="mt-1 text-sm text-red-700">
                  Nombre requerido, minimo 3 caracteres maximo 45
                </p>
              )}
              <div className="w-full flex flex-row-reverse gap-x-4">
                <button
                  className="btn btn-outline btn-error"
                  type="button"
                  onClick={() =>
                    document.getElementById(`modal_edit_line_${idLine}`).close()
                  }
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={isLoading}
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

export const RegisterUserLine = ({
  resetData,
  notification,
  url,
  token,
  idLine,
  nameLine,
  users = [],
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userSelected, setUserSelected] = useState(0);

  const onSubmit = async (e) => {
    try {
      e.preventDefault();

      const data = {
        id_linea: parseInt(idLine),
        id_usuario: userSelected.value,
      };

      const existUser = users.some(
        (user) => user.codigo_usuario === data.id_usuario
      );

      if (existUser) {
        notification.error("El usuario ya esta registrado");
        return;
      }

      setIsLoading(true);
      const response = await fetch(`${url}/lineas/usuariolinea`, {
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
      document.getElementById("modal_add_user").close();
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
        className="btn btn-success"
        onClick={() => document.getElementById("modal_add_user").showModal()}
      >
        Agregar recurso
      </button>
      <dialog id="modal_add_user" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Agregar recurso al proyecto {`${nameLine}`}!
          </h3>
          <p className="">Ingrese el nombre del recurso</p>
          <div className="w-full">
            <form
              method="dialog"
              className="flex flex-col gap-y-2 mt-2"
              onSubmit={onSubmit}
            >
              <div className="w-full">
                <Select
                  loadOptions={loadOptions}
                  onChange={(selectedOption) => setUserSelected(selectedOption)}
                />
              </div>
              <div className="w-full flex flex-row-reverse gap-x-4">
                <button
                  className="btn btn-outline btn-error"
                  type="button"
                  onClick={() =>
                    document.getElementById("modal_add_user").close()
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
