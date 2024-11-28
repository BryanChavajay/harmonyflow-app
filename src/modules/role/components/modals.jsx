import { useState } from "react";
import { useForm } from "react-hook-form";

export const RegisterRole = ({ resetData, notification, url, token }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    const dataRole = {
      rol: data.rol,
      permisos: [
        {
          id_modulo: 1,
          activo: true,
        },
        {
          id_modulo: 2,
          activo: true,
        },
        {
          id_modulo: 3,
          activo: true,
        },
        {
          id_modulo: 4,
          activo: data.pruebas,
        },
        {
          id_modulo: 5,
          activo: data.proyectos,
        },
        {
          id_modulo: 6,
          activo: data.lineas,
        },
        {
          id_modulo: 7,
          activo: data.estadisticas,
        },
        {
          id_modulo: 8,
          activo: data.usuarios,
        },
        {
          id_modulo: 9,
          activo: data.roles,
        },
      ],
    };

    try {
      notification.info("Registrando ROL");
      setIsLoading(true);
      const response = await fetch(`${url}/roles/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataRole),
      });

      const jsonResponse = await response.json();
      if (!response.ok) {
        console.log(jsonResponse.message);
        const message = "Algo salió mal, comuníquese con soporte";
        notification.error(message);
        return;
      }

      notification.success(jsonResponse.message);
      document.getElementById("modal_add_role").close();
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
        onClick={() => document.getElementById("modal_add_role").showModal()}
      >
        Nuevo rol
      </button>
      <dialog id="modal_add_role" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Registrar Rol!</h3>
          <p className="">
            Registre un nombre y active los modulos donde tendrá acceso
          </p>
          <div className="w-full">
            <form
              method="dialog"
              className="flex flex-col gap-y-1 mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <label
                className={`input input-bordered ${
                  errors.rol ? "input-error" : ""
                } flex items-center gap-2`}
              >
                Nombre Rol:
                <input
                  type="text"
                  className="grow"
                  {...register("rol", {
                    maxLength: 50,
                    minLength: 5,
                    required: true,
                  })}
                />
              </label>
              {errors.rol && (
                <p role="alert" className="mt-1 text-sm text-red-700">
                  Rol requerido, minimo 5 caracteres maximo 50
                </p>
              )}
              <div className="w-full flex justify-between py-1">
                <p className="label-text text-gray-800 ml-1">MI AGENDA</p>
                <p className="label-text">SIEMPRE ACTIVO</p>
              </div>
              <div className="w-full flex justify-between py-1">
                <p className="label-text text-gray-800 ml-1">MI TABLERO</p>
                <p className="label-text">SIEMPRE ACTIVO</p>
              </div>
              <div className="w-full flex justify-between py-1">
                <p className="label-text text-gray-800 ml-1">BACKLOG</p>
                <p className="label-text">SIEMPRE ACTIVO</p>
              </div>
              <div className="form-control w-full">
                <label className="label cursor-pointer">
                  <span className="label-text">PRUEBAS</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-success"
                    defaultChecked
                    {...register("pruebas")}
                  />
                </label>
              </div>
              <div className="form-control w-full">
                <label className="label cursor-pointer">
                  <span className="label-text">PROYECTOS</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-success"
                    defaultChecked
                    {...register("proyectos")}
                  />
                </label>
              </div>
              <div className="form-control w-full">
                <label className="label cursor-pointer">
                  <span className="label-text">LINEAS DESARROLLO</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-success"
                    defaultChecked
                    {...register("lineas")}
                  />
                </label>
              </div>
              <div className="form-control w-full">
                <label className="label cursor-pointer">
                  <span className="label-text">ESTADISTICAS</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-success"
                    defaultChecked
                    {...register("estadisticas")}
                  />
                </label>
              </div>
              <div className="form-control w-full">
                <label className="label cursor-pointer">
                  <span className="label-text">USUARIOS</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-success"
                    defaultChecked
                    {...register("usuarios")}
                  />
                </label>
              </div>
              <div className="form-control w-full">
                <label className="label cursor-pointer">
                  <span className="label-text">ROLES</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-success"
                    defaultChecked
                    {...register("roles")}
                  />
                </label>
              </div>
              <div className="w-full flex flex-row-reverse gap-x-4">
                <button
                  className="btn btn-outline btn-error"
                  type="button"
                  onClick={() =>
                    document.getElementById("modal_add_role").close()
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

export const ViewDetailRole = ({ notification, url, token, id_rol }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});

  const modules = [
    { id_modulo: 1, modulo: "MI-AGENDA" },
    { id_modulo: 2, modulo: "MI-TABLERO" },
    { id_modulo: 3, modulo: "BACKLOG" },
    { id_modulo: 4, modulo: "PRUEBAS" },
    { id_modulo: 5, modulo: "PROYECTOS" },
    { id_modulo: 6, modulo: "LINEAS-DESARROLLO" },
    { id_modulo: 7, modulo: "ESTADISTICAS" },
    { id_modulo: 8, modulo: "USUARIOS" },
    { id_modulo: 9, modulo: "ROLES" },
  ];

  const getDetail = async () => {
    try {
      notification.info("Obtenido Rol");
      setIsLoading(true);
      const response = await fetch(`${url}/roles/${id_rol}`, {
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
      setData(jsonResponse.data);
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
    document.getElementById(`view_detail_rol_${id_rol}`).showModal();
    getDetail();
  };

  const assignedModules = data.permisos?.map((permiso) => {
    const module = modules.find((mod) => mod.id_modulo === permiso.id_modulo);
    return module
      ? { nombre: module.modulo, id: module.id_modulo }
      : { nombre: "Desconocido", id: 0 };
  });

  return (
    <>
      <button className="bg-gray-400 hover:bg-gray-500 cursor-pointer p-2 text-xs text-white rounded-lg" onClick={openModal}>
        VER
      </button>
      <dialog id={`view_detail_rol_${id_rol}`} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{`Detalles del rol ${id_rol}`}</h3>
          <p className="">Nombre de rol {data?.rol}</p>
          <div>
            {isLoading ? (
              <p>Cargando...</p>
            ) : (
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Id del modulo</th>
                    <th>Modulo</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedModules?.map((modulo, index) => (
                    <tr key={index}>
                      <td>{modulo.id}</td>
                      <td>{modulo.nombre}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div>
            <p className="text-xs">Puede precionar ESC para salir</p>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">CERRAR</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};
