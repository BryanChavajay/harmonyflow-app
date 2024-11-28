import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
} from "@tanstack/react-table";
import { EditProject, DeleteProject } from "./modals.jsx";

export const TableProjects = ({
  data,
  notification,
  url,
  token,
  resetData,
}) => {
  const [sorting, setSorting] = useState([]);

  const columns = [
    {
      header: "Id",
      accessorKey: "id_proyecto",
    },
    {
      header: "Nombre",
      accessorKey: "nombre",
    },
    {
      header: "Descripción",
      accessorKey: "descripcion",
    },
    {
      header: "linea",
      accessorKey: "id_linea",
    },
    {
      header: "Costo estimado",
      accessorKey: "costo_estimado",
    },
    {
      header: "Fecha de inicio",
      accessorKey: "fecha_inicio",
    },
    {
      header: "Fecha de finalizacion",
      accessorKey: "fecha_final",
    },
    {
      header: "activo",
      accessorKey: "activo",
    },
    {
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex flex-row gap-x-2">
          <EditProject
            notification={notification}
            url={url}
            token={token}
            idProject={row.original.id_proyecto}
            resetData={resetData}
          />
          <DeleteProject
            notification={notification}
            url={url}
            token={token}
            idProject={row.original.id_proyecto}
            resetData={resetData}
            nameProject={row.original.nombre}
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
    <div className="overflow-x-auto">
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
