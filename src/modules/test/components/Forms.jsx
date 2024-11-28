import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import Select from "react-select";

export const CaseTestForm = ({
  projects,
  projectsCharged,
  notification,
  url,
  token,
}) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre_caso: "",
      descripcion_caso: "",
      criterios_aceptacion: "",
      prueba_automatizada: null,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [esAutomatizada, setEsAutomatizada] = useState(false);

  // Manejo de array de campos en "prueba_automatizada"
  const { fields, append, remove } = useFieldArray({
    control,
    name: "prueba_automatizada.campos", // Ruta hacia los campos dentro de prueba_automatizada
  });

  const tipoDatoOpciones = [
    { value: 1, label: "Número" },
    { value: 2, label: "String" },
  ];

  // Submit del formulario
  const onSubmit = async (data) => {
    try {
      let newData = {
        id_proyecto: parseInt(data.id_proyecto),
        nombre_caso: data.nombre_caso,
        descripcion_caso: data.descripcion_caso,
        criterios_aceptacion: data.criterios_aceptacion,
      };

      if (esAutomatizada) {
        newData.prueba_automatizada = {
          estado_esperado: parseInt(data.prueba_automatizada.estado_esperado),
          campos: data.prueba_automatizada.campos.map((campo) => ({
            tipo_dato: parseInt(campo.tipo_dato),
            nombre_campo: campo.nombre_campo,
            contenido: campo.contenido,
          })),
        };
      }

      notification.info("Registrando caso de prueba");
      setIsLoading(true);
      const response = await fetch(`${url}/pruebas/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newData),
      });

      const jsonResponse = await response.json();
      if (!response.ok) {
        console.log(jsonResponse.message);
        const message = "Algo salió mal, comuníquese con soporte";
        notification.error(message);
        return;
      }

      notification.success(jsonResponse.message);
      reset();
      setEsAutomatizada(false);
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
    <div className="">
      <article className="mb-2">
        <p className="text-sm font-semibold text-gray-700">
          Por favor ingrese los datos solicitados:
        </p>
      </article>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <section className="w-full flex flex-row gap-x-8">
          <div className="w-1/2">
            <label htmlFor="nombre_caso" className="text-base text-gray-700">
              Nombre del Caso
            </label>
            <input
              type="text"
              {...register("nombre_caso", { required: true, maxLength: 75 })}
              className={`input input-md input-bordered w-full ${
                errors.nombre_caso ? "input-error" : ""
              }`}
              placeholder="Ejemplo: Caso de prueba 1"
            />
            {errors.nombre_caso && (
              <p role="alert" className="mt-1 text-sm text-red-700">
                Nombre del caso obligatorio, máximo 75 caracteres
              </p>
            )}
          </div>
          <div className="w-1/2">
            <label className="block text-base text-gray-700">Proyecto</label>
            <select
              {...register(`id_proyecto`, {
                required: true,
              })}
              className={`w-full select select-bordered ${
                errors?.id_proyecto ? "select-error" : ""
              }`}
            >
              {projects.map((dato, index) => (
                <option key={index} value={dato.value}>
                  {dato.label}
                </option>
              ))}
            </select>
            {errors?.id_proyecto && (
              <p className="text-sm text-red-700">
                Debe seleccionar un proyecto
              </p>
            )}
          </div>
        </section>

        {/* Descripción del caso */}
        <div className="">
          <label htmlFor="descripcion_caso" className="text-base text-gray-700">
            Descripción del Caso
          </label>
          <input
            type="text"
            {...register("descripcion_caso", {
              required: true,
              maxLength: 75,
            })}
            className={`input input-md input-bordered w-full ${
              errors.descripcion_caso ? "input-error" : ""
            }`}
            placeholder="Ejemplo: Prueba de funcionalidad X"
          />
          {errors.descripcion_caso && (
            <p role="alert" className="mt-1 text-sm text-red-700">
              Descripcion de caso obligatoria, máximo 75 caracteres
            </p>
          )}
        </div>

        {/* Criterios de aceptación */}
        <div className="">
          <label
            htmlFor="criterios_aceptacion"
            className="text-base text-gray-700"
          >
            Criterios de Aceptación
          </label>
          <textarea
            {...register("criterios_aceptacion", { required: true })}
            className={`w-full textarea textarea-bordered ${
              errors.criterios_aceptacion ? "textarea-error" : ""
            }`}
            placeholder="Describa los criterios de aceptación"
          ></textarea>
          {errors.criterios_aceptacion && (
            <p role="alert" className="mt-1 text-sm text-red-700">
              Criterios de aceptación obligatorios
            </p>
          )}
        </div>

        {/* Toggle: Prueba automatizada */}
        <div className="flex items-center gap-x-4">
          <label className="text-base text-gray-700">
            ¿Es una prueba automatizada?
          </label>
          <input
            type="checkbox"
            checked={esAutomatizada}
            onChange={(e) => {
              setEsAutomatizada(e.target.checked);
              if (!e.target.checked) {
                reset({ ...watch(), prueba_automatizada: null });
              }
            }}
            className="checkbox"
          />
        </div>

        {/* Sección de Prueba Automatizada */}
        {esAutomatizada && (
          <div className="">
            <div className="flex flex-row gap-x-4 items-end">
              <div className="">
                <label
                  htmlFor="estado_esperado"
                  className="text-base text-gray-700"
                >
                  Estado Esperado
                </label>
                <input
                  type="number"
                  {...register("prueba_automatizada.estado_esperado", {
                    required: esAutomatizada,
                    min: 0,
                  })}
                  className={`ml-4 input input-sm input-bordered ${
                    errors?.prueba_automatizada?.estado_esperado
                      ? "input-error"
                      : ""
                  }`}
                  placeholder="Ejemplo: 1"
                />
                {errors?.prueba_automatizada?.estado_esperado && (
                  <p className="text-sm text-red-700">
                    Debe ingresar un estado HTTP esperado
                  </p>
                )}
              </div>

              {/* Botón para agregar campo */}
              <button
                type="button"
                onClick={() =>
                  append({ tipo_dato: "", nombre_campo: "", contenido: "" })
                }
                className="btn btn-sm"
              >
                Agregar Campo
              </button>
            </div>

            {/* Lista de Campos */}
            <h2 className="text-base font-semibold text-gray-700 mb-2">
              Campos
            </h2>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border border-gray-300 p-4 rounded-md flex flex-row gap-x-4 items-center mt-2"
              >
                {/* Tipo de dato */}
                <div className="">
                  <label className="block text-base text-gray-700">
                    Tipo de Dato
                  </label>
                  <select
                    {...register(
                      `prueba_automatizada.campos.${index}.tipo_dato`,
                      { required: true }
                    )}
                    className={`select select-bordered ${
                      errors?.prueba_automatizada?.campos?.[index]?.tipo_dato
                        ? "select-error"
                        : ""
                    }`}
                  >
                    {tipoDatoOpciones.map((dato, index) => (
                      <option key={index} value={dato.value}>
                        {dato.label}
                      </option>
                    ))}
                  </select>
                  {errors?.prueba_automatizada?.campos?.[index]?.tipo_dato && (
                    <p className="text-sm text-red-700">
                      Debe seleccionar un tipo de dato
                    </p>
                  )}
                </div>

                {/* Nombre del campo */}
                <div className="w-80">
                  <label className="block text-base text-gray-700">
                    Nombre del Campo
                  </label>
                  <input
                    type="text"
                    {...register(
                      `prueba_automatizada.campos.${index}.nombre_campo`,
                      { required: true, maxLength: 100 }
                    )}
                    className={`input input-bordered w-full ${
                      errors?.prueba_automatizada?.campos?.[index]?.nombre_campo
                        ? "input-error"
                        : ""
                    }`}
                    placeholder="Ejemplo: Campo 1"
                  />
                  {errors?.prueba_automatizada?.campos?.[index]
                    ?.nombre_campo && (
                    <p className="text-sm text-red-700">
                      Campo requerido, máximo 100 caracteres
                    </p>
                  )}
                </div>

                {/* Contenido */}
                <div className="w-[500px]">
                  <label className="block text-base text-gray-700">
                    Contenido
                  </label>
                  <input
                    type="text"
                    {...register(
                      `prueba_automatizada.campos.${index}.contenido`,
                      { required: true }
                    )}
                    className={`input input-bordered w-full ${
                      errors?.prueba_automatizada?.campos?.[index]?.contenido
                        ? "input-error"
                        : ""
                    }`}
                    placeholder="Ejemplo: Valor del campo"
                  />
                  {errors?.prueba_automatizada?.campos?.[index]?.contenido && (
                    <p className="text-sm text-red-700">Campo requerido</p>
                  )}
                </div>

                {/* Botón para eliminar campo */}
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="btn btn-error btn-outline btn-xs"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Botón de envío */}
        <div className="">
          <button
            type="submit"
            className="btn btn-success btn-block"
            disabled={isLoading || !projectsCharged}
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
};
