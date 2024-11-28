import { useState } from "react";

export const DeleteError = ({
  resetData,
  notification,
  url,
  token,
  idError,
  descriptionError,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e) => {
    try {
      e.preventDefault();

      const data = {
        id_error: idError,
        resuelto: true,
      };

      setIsLoading(true);
      const response = await fetch(`${url}/pruebas/error`, {
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
      document.getElementById(`modal_delete_error${idError}`).close();
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
        className="btn btn-info btn-outline btn-xs"
        onClick={() =>
          document.getElementById(`modal_delete_error${idError}`).showModal()
        }
      >
        Resuelto
      </button>
      <dialog id={`modal_delete_error${idError}`} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Cerrando el error!</h3>
          <p className="">
            ¿Esta seguro de marcar el Error No{` ${idError} `}como resuelto?
          </p>
          <div className="w-full">
            <form
              method="dialog"
              className="flex flex-col gap-y-2 mt-2"
              onSubmit={onSubmit}
            >
              <div role="alert" className="alert alert-warning">
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span>{`Marcando como resuelto el error: ${descriptionError}`}</span>
              </div>
              <div className="w-full flex flex-row-reverse gap-x-4">
                <button
                  className="btn"
                  type="button"
                  onClick={() =>
                    document
                      .getElementById(`modal_delete_error${idError}`)
                      .close()
                  }
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-success btn-outline"
                  disabled={isLoading}
                >
                  RESUELTO{" "}
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
