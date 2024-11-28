import { useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";

export const RegisterUser = ({ resetData, notification, url, token }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [roleCharged, setRoleCharged] = useState(false);
  const [roles, setRoles] = useState([]);
  const [rolSelected, setRolSelected] = useState(0);

  const onSubmit = async (data) => {
    try {
      data.id_rol = rolSelected.value;
      data.costo_hora = parseFloat(data.costo_hora);

      notification.info("Registrando Usuario");
      setIsLoading(true);
      const response = await fetch(`${url}/usuarios/`, {
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

  const getRoles = async () => {
    try {
      notification.info("Obtenido Roles");
      setIsLoading(true);
      const response = await fetch(`${url}/roles/`, {
        method: "GET",
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
      const roles = jsonResponse.data.map((role) => ({
        value: role.id_rol,
        label: role.rol,
      }));

      setRoles(roles);
      setRoleCharged(true);
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
    document.getElementById("modal_add_user").showModal();
    getRoles();
  };

  return (
    <>
      <button className="btn btn-success" onClick={openModal}>
        Nuevo Usuario
      </button>
      <dialog id="modal_add_user" className="modal">
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
                  errors.nombre ? "input-error" : ""
                } flex items-center gap-2`}
              >
                Nombre:
                <input
                  type="text"
                  className="grow"
                  {...register("nombre", {
                    maxLength: 50,
                    minLength: 3,
                    required: true,
                  })}
                />
              </label>
              {errors.nombre && (
                <p role="alert" className="mt-1 text-sm text-red-700">
                  Nombre requerido, minimo 3 caracteres maximo 50
                </p>
              )}
              <label
                className={`input input-bordered ${
                  errors.usuario ? "input-error" : ""
                } flex items-center gap-2`}
              >
                Usuario:
                <input
                  type="text"
                  className="grow"
                  {...register("usuario", {
                    maxLength: 25,
                    minLength: 5,
                    required: true,
                  })}
                />
              </label>
              {errors.usuario && (
                <p role="alert" className="mt-1 text-sm text-red-700">
                  Usuario requerido, minimo 5 caracteres maximo 25
                </p>
              )}
              <label
                className={`input input-bordered ${
                  errors.correo ? "input-error" : ""
                } flex items-center gap-2`}
              >
                Correo:
                <input
                  type="email"
                  className="grow"
                  {...register("correo", {
                    required: true,
                  })}
                />
              </label>
              {errors.correo && (
                <p role="alert" className="mt-1 text-sm text-red-700">
                  Correo requerido, example@example.com
                </p>
              )}
              <label
                className={`input input-bordered ${
                  errors.contrasenia ? "input-error" : ""
                } flex items-center gap-2`}
              >
                Contraseña:
                <input
                  type="password"
                  className="grow"
                  {...register("contrasenia", {
                    maxLength: 35,
                    minLength: 5,
                    required: true,
                  })}
                />
              </label>
              {errors.contrasenia && (
                <p role="alert" className="mt-1 text-sm text-red-700">
                  Contraseña requerida, minimo 5 caracteres máximo 35
                </p>
              )}
              <p className="label-text">Seleccione el rol</p>
              <div className="w-full">
                <Select
                  options={roles}
                  onChange={(selectedOption) => setRolSelected(selectedOption)}
                />
              </div>
              <div className="form-control w-full">
                <label className="label cursor-pointer">
                  <span className="label-text">Esta activo:</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-success"
                    defaultChecked
                    {...register("esta_activo")}
                  />
                </label>
              </div>
              <label
                className={`input input-bordered ${
                  errors.costo_hora ? "input-error" : ""
                } flex items-center gap-2`}
              >
                Costo x hora:
                <input
                  type="number"
                  className="grow"
                  {...register("costo_hora", {
                    min: 0,
                    required: true,
                  })}
                />
              </label>
              {errors.costo_hora && (
                <p role="alert" className="mt-1 text-sm text-red-700">
                  El costo por hora es requerido, minimo 0
                </p>
              )}
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
                  disabled={isLoading || !roleCharged || rolSelected === 0}
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

export const EditUser = ({ resetData, notification, url, token, idUser }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [roleCharged, setRoleCharged] = useState(false);
  const [roles, setRoles] = useState([]);
  const [rolSelected, setRolSelected] = useState(0);

  const onSubmit = async (data) => {
    try {
      data.id_rol = rolSelected.value;
      data.costo_hora = parseFloat(data.costo_hora);
      data.codigo_usuario = idUser;

      if (data.contrasenia === "") {
        delete data["contrasenia"];
      }

      notification.info("Registrando Usuario");
      setIsLoading(true);
      const response = await fetch(`${url}/usuarios/`, {
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
      document.getElementById(`modal_edit_user_${idUser}`).close();
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

  const getRoles = async () => {
    try {
      notification.info("Obtenido Roles");
      setIsLoading(true);
      const response = await fetch(`${url}/roles/`, {
        method: "GET",
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
      const roles = jsonResponse.data.map((role) => ({
        value: role.id_rol,
        label: role.rol,
      }));

      setRoles(roles);
      setRoleCharged(true);
    } catch (error) {
      console.log(error);
      notification.error(
        "Ocurrió un problema inesperado, comuníquese con soporte"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getUser = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${url}/usuarios/buscar?codigo=${idUser}`, {
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
      setValue("usuario", jsonResponse.data.usuario);
      setValue("correo", jsonResponse.data.correo);
      setValue("esta_activo", jsonResponse.data.esta_activo);
      setValue("costo_hora", jsonResponse.data.costo_hora);
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
    document.getElementById(`modal_edit_user_${idUser}`).showModal();
    getRoles();
    getUser();
  };

  return (
    <>
      <button className="btn btn-xs" onClick={openModal}>
        Editar
      </button>
      <dialog id={`modal_edit_user_${idUser}`} className="modal">
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
                  errors.nombre ? "input-error" : ""
                } flex items-center gap-2`}
              >
                Nombre:
                <input
                  type="text"
                  className="grow"
                  {...register("nombre", {
                    maxLength: 50,
                    minLength: 3,
                    required: true,
                  })}
                />
              </label>
              {errors.nombre && (
                <p role="alert" className="mt-1 text-sm text-red-700">
                  Nombre requerido, minimo 3 caracteres maximo 50
                </p>
              )}
              <label
                className={`input input-bordered ${
                  errors.usuario ? "input-error" : ""
                } flex items-center gap-2`}
              >
                Usuario:
                <input
                  type="text"
                  className="grow"
                  {...register("usuario", {
                    maxLength: 25,
                    minLength: 5,
                    required: true,
                  })}
                />
              </label>
              {errors.usuario && (
                <p role="alert" className="mt-1 text-sm text-red-700">
                  Usuario requerido, minimo 5 caracteres maximo 25
                </p>
              )}
              <label
                className={`input input-bordered ${
                  errors.correo ? "input-error" : ""
                } flex items-center gap-2`}
              >
                Correo:
                <input
                  type="email"
                  className="grow"
                  {...register("correo", {
                    required: true,
                  })}
                />
              </label>
              {errors.correo && (
                <p role="alert" className="mt-1 text-sm text-red-700">
                  Correo requerido, example@example.com
                </p>
              )}
              <label
                className={`input input-bordered ${
                  errors.contrasenia ? "input-error" : ""
                } flex items-center gap-2`}
              >
                Contraseña:
                <input
                  type="password"
                  className="grow"
                  {...register("contrasenia", {
                    maxLength: 35,
                    minLength: 5,
                  })}
                />
              </label>
              {errors.contrasenia && (
                <p role="alert" className="mt-1 text-sm text-red-700">
                  Contraseña requerida, minimo 5 caracteres máximo 35
                </p>
              )}
              <p className="label-text">Seleccione el rol</p>
              <div className="w-full">
                <Select
                  options={roles}
                  onChange={(selectedOption) => setRolSelected(selectedOption)}
                />
              </div>
              <div className="form-control w-full">
                <label className="label cursor-pointer">
                  <span className="label-text">Esta activo:</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-success"
                    defaultChecked
                    {...register("esta_activo")}
                  />
                </label>
              </div>
              <label
                className={`input input-bordered ${
                  errors.costo_hora ? "input-error" : ""
                } flex items-center gap-2`}
              >
                Costo x hora:
                <input
                  type="number"
                  className="grow"
                  {...register("costo_hora", {
                    min: 0,
                    required: true,
                  })}
                />
              </label>
              {errors.costo_hora && (
                <p role="alert" className="mt-1 text-sm text-red-700">
                  El costo por hora es requerido, minimo 0
                </p>
              )}
              <div className="w-full flex flex-row-reverse gap-x-4">
                <button
                  className="btn btn-outline btn-error"
                  type="button"
                  onClick={() =>
                    document.getElementById(`modal_edit_user_${idUser}`).close()
                  }
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={isLoading || !roleCharged || rolSelected === 0}
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
export const DeleteUser = ({
  resetData,
  notification,
  url,
  token,
  idUser,
  nameUser,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const response = await fetch(`${url}/usuarios/?id=${idUser}`, {
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
      document.getElementById(`modal_delete_user_${idUser}`).close();
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
          document.getElementById(`modal_delete_user_${idUser}`).showModal()
        }
      >
        Eliminar
      </button>
      <dialog id={`modal_delete_user_${idUser}`} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Eliminando usuario!</h3>
          <p className="">¿Esta seguro de eliminar al usuario?</p>
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
                <span>{`Esta apunto de eliminar el usuario ${nameUser}`}</span>
              </div>
              <div className="w-full flex flex-row-reverse gap-x-4">
                <button
                  className="btn"
                  type="button"
                  onClick={() =>
                    document
                      .getElementById(`modal_delete_user_${idUser}`)
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
