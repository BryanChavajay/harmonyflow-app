import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
} from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { EditTask, DeleteTask } from "../../board/components/Modals.jsx";
import { DeleteError } from "./Modals.jsx";

export const TableTasks = ({
  data,
  notification,
  url,
  token,
  resetData,
  projects,
  projectsCharged,
}) => {
  const [sorting, setSorting] = useState([]);

  const columns = [
    {
      header: "Nombre tarea",
      accessorKey: "nombre_tarea",
    },
    {
      header: "Descipción tarea",
      accessorKey: "descripcion_tarea",
    },
    {
      header: "Fecha inicio",
      accessorKey: "fecha_inicio",
    },
    {
      header: "Fecha finalización",
      accessorKey: "fecha_finalizacion",
    },
    {
      header: "Fecha real inicio",
      accessorKey: "fecha_real_inicio",
    },
    {
      header: "Fecha real finalización",
      accessorKey: "fecha_real_finalizacion",
    },
    {
      header: "Proyecto",
      accessorKey: "id_proyecto",
    },
    {
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex flex-row gap-x-2">
          <EditTask
            notification={notification}
            url={url}
            token={token}
            idTask={row.original.id_tarea}
            resetData={resetData}
            projects={projects}
            projectsCharged={projectsCharged}
          />
          <DeleteTask
            notification={notification}
            url={url}
            token={token}
            idTask={row.original.id_tarea}
            resetData={resetData}
            nameTask={row.original.nombre_tarea}
          />
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  return (
    <div className="overflow-x-auto bg-white">
      <table className="table table-zebra table-md">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="cursor-pointer"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.column.columnDef.header}{" "}
                  {
                    {
                      asc: "⬆️",
                      desc: "⬇️",
                    }[header.column.getIsSorted() ?? null]
                  }
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const TableErrors = ({ data, notification, url, token, resetData }) => {
  const [sorting, setSorting] = useState([]);

  const columns = [
    {
      header: "Numero de error",
      accessorKey: "id_error",
    },
    {
      header: "Descripción",
      accessorKey: "descripcion",
    },
    {
      header: "Fecha reporte",
      accessorKey: "fecha_reporte",
    },
    {
      header: "Resuelto",
      accessorKey: "resuelto",
    },
    {
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex flex-row gap-x-2">
          <DeleteError
            notification={notification}
            url={url}
            token={token}
            resetData={resetData}
            descriptionError={row.original.descripcion}
            idError={row.original.id_error}
          />
          <Link
            className="btn btn-neutral btn-outline btn-xs"
            to={`/backlog/error/${row.original.id_caso_prueba}`}
          >
            Ver
          </Link>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  return (
    <div className="overflow-x-auto bg-white">
      <table className="table table-zebra table-md">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="cursor-pointer"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.column.columnDef.header}{" "}
                  {
                    {
                      asc: "⬆️",
                      desc: "⬇️",
                    }[header.column.getIsSorted() ?? null]
                  }
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
