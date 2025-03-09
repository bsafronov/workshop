"use client";

import { ColumnType } from "@/const/column-type";
import { Column, Row } from "@/db/schema";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

type ParsedRow = Pick<
  Row,
  "createdAt" | "updatedAt" | "createdById" | "updatedById" | "id"
> & {
  [key: string]: unknown;
};

const helper = createColumnHelper<ParsedRow>();

const getColumns = (columns: Column[]) => {
  const dynamicColumns = columns.map((column) => {
    const { id, name, type } = column;

    return helper.accessor(id, {
      header: name,
      cell: (ctx) => getCell({ type, value: ctx.getValue() }),
    });
  });

  const createdAtColumn = helper.accessor("createdAt", {
    header: "Дата создания",
    cell: (ctx) => {
      const date = ctx.getValue();
      const isValid = date instanceof Date && !isNaN(date.getTime());
      if (!isValid) return null;

      return date.toLocaleString();
    },
  });

  const updatedAtColumn = helper.accessor("updatedAt", {
    header: "Дата обновления",
    cell: (ctx) => {
      const date = ctx.getValue();
      return date?.toLocaleString();
    },
  });

  const createdByIdColumn = helper.accessor("createdById", {
    header: "ID создателя",
    cell: (ctx) => ctx.getValue(),
  });

  const updatedByIdColumn = helper.accessor("updatedById", {
    header: "ID обновителя",
    cell: (ctx) => ctx.getValue(),
  });

  return [
    ...dynamicColumns,
    createdAtColumn,
    updatedAtColumn,
    createdByIdColumn,
    updatedByIdColumn,
  ];
};

const getCell = ({ value }: { type: ColumnType; value: unknown }) => {
  switch (typeof value) {
    case "string":
    case "number":
      return value;
    case "boolean":
      return value ? "Да" : "Нет";
    case "object":
      if (value instanceof Date) {
        return value.toLocaleString();
      }
      return JSON.stringify(value);
  }
};

export const getData = (data: Row[]): ParsedRow[] => {
  return data.map((row) => {
    const { createdAt, createdById, updatedAt, updatedById, id, data } = row;

    return {
      createdAt,
      createdById,
      updatedAt,
      updatedById,
      id,
      ...data,
    };
  });
};

type DynamicDataTableProps = {
  tableId: string;
};

export const DynamicDataTable = ({ tableId }: DynamicDataTableProps) => {
  const trpc = useTRPC();

  const { data: serverColumns } = useQuery(
    trpc.table.getColumns.queryOptions({ tableId })
  );
  const { data: serverData } = useQuery(
    trpc.table.getRows.queryOptions({ tableId })
  );

  const columns = useMemo(() => {
    if (!serverColumns) return [];
    return getColumns(serverColumns);
  }, [serverColumns]) as ColumnDef<ParsedRow>[];

  const data = useMemo(() => {
    if (!serverData) return [];
    return getData(serverData);
  }, [serverData]);

  return <DataTable data={data} columns={columns} />;
};

type DataTableProps<TRow, TColumn> = {
  data: TRow[];
  columns: TColumn[];
};

export const DataTable = <TRow, TColumn extends ColumnDef<TRow, unknown>>({
  columns,
  data,
}: DataTableProps<TRow, TColumn>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
        {table.getRowModel().rows.length === 0 && (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center">
              Нет данных
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
