import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
} from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { EditLine } from "./modals.jsx";

export const TableLines = ({ data, notification, url, token, resetData }) => {
  const [sorting, setSorting] = useState([]);

  const columns = [
    {
      header: "Id",
      accessorKey: "id_linea",
    },
    {
      header: "Nombre linea",
      accessorKey: "linea",
    },
    {
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex flex-row gap-x-2">
          <EditLine
            notification={notification}
            url={url}
            token={token}
            idLine={row.original.id_linea}
            resetData={resetData}
          />
          <Link className="btn btn-xs" to={`/lineas/${row.original.id_linea}`}>
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

export const TableUsersLine = ({
  data,
  notification,
  url,
  token,
  resetData,
}) => {
  const [sorting, setSorting] = useState([]);

  const columns = [
    {
      header: "Nombre",
      accessorKey: "nombre",
    },
    {
      header: "Correo",
      accessorKey: "correo",
    },
    {
      header: "Costo hora",
      accessorKey: "costo_hora",
    },
    // {
    //   header: "Acciones",
    //   cell: ({ row }) => (
    //     <div className="flex flex-row gap-x-2">
    //       <EditLine
    //         notification={notification}
    //         url={url}
    //         token={token}
    //         idLine={row.original.id_linea}
    //         resetData={resetData}
    //       />
    //       <Link className="btn btn-xs" to={`/lineas/${row.original.id_linea}`}>
    //         Ver
    //       </Link>
    //     </div>
    //   ),
    // },
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
