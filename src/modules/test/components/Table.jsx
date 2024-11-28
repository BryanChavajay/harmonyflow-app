import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
} from "@tanstack/react-table";
import { Link } from "react-router-dom";

export const TableCases = ({
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
      header: "Numero Caso",
      accessorKey: "id_caso_prueba",
    },
    {
      header: "Nombre",
      accessorKey: "nombre_caso",
    },
    {
      header: "Descipción",
      accessorKey: "descripcion_caso",
    },
    {
      header: "Proyecto",
      accessorKey: "Proyecto.nombre",
    },
    {
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex flex-row gap-x-2">
          <Link
            className="btn btn-info btn-outline btn-xs"
            to={`/pruebas/caso/${row.original.id_caso_prueba}`}
          >
            VER
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

export const TableCampTest = ({
  data,
  notification,
  url,
  token,
  resetData,
  projects,
  projectsCharged,
  dataTypes,
}) => {
  const [sorting, setSorting] = useState([]);

  const columns = [
    {
      header: "Tipo de dato",
      cell: ({ row }) => (
        <p>
          {dataTypes.find((item) => (item.id = row.original.tipo_dato)).label ||
            "Desconocido"}
        </p>
      ),
    },
    {
      header: "Nombre del campo",
      accessorKey: "nombre_campo",
    },
    {
      header: "Contenido",
      accessorKey: "contenido",
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

export const TableErrors = ({
  data,
  notification,
  url,
  token,
  resetData,
  projects,
  projectsCharged,
  dataTypes,
}) => {
  const [sorting, setSorting] = useState([]);

  const columns = [
    {
      header: "No de error",
      accessorKey: "id_error",
    },
    {
      header: "Descripción",
      accessorKey: "descripcion",
    },
    {
      header: "Usuario asignado",
      accessorKey: "usuarioAsignado.nombre",
    },
    {
      header: "Fecha reporte",
      accessorKey: "fecha_reporte",
    },
    {
      header: "Resuelto",
      cell: ({ row }) =>
        row.original.resuelto ? (
          <div className="badge badge-accent gap-2">SI</div>
        ) : (
          <div className="badge badge-error gap-2">NO</div>
        ),
    },
    {
      header: "Fecha resuelto",
      accessorKey: "fecha_resuelto",
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
