import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
} from "@tanstack/react-table";
import { EditUser, DeleteUser } from "./modals.jsx";

export const TableUsers = ({ data, notification, url, token, resetData }) => {
  const [sorting, setSorting] = useState([]);

  const columns = [
    {
      header: "Nombre",
      accessorKey: "nombre",
    },
    {
      header: "Usuario",
      accessorKey: "usuario",
    },
    {
      header: "Correo",
      accessorKey: "correo",
    },
    {
      header: "Activo",
      accessorKey: "esta_activo",
    },
    {
      header: "Rol",
      accessorKey: "id_rol",
    },
    {
      header: "Costo x hora",
      accessorKey: "costo_hora",
    },
    {
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex flex-row gap-x-2">
          <EditUser
            notification={notification}
            url={url}
            token={token}
            idUser={row.original.codigo_usuario}
            resetData={resetData}
          />
          <DeleteUser
            notification={notification}
            url={url}
            token={token}
            idUser={row.original.codigo_usuario}
            resetData={resetData}
            nameUser={row.original.nombre}
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
