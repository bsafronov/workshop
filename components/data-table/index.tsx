"use client";

import { ColumnType } from "@/const/column-type";
import { Column } from "@/db/schema";
import { useTRPC } from "@/trpc/client";
import { RouterOutputs } from "@/trpc/init";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Check } from "lucide-react";
import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

type Row = RouterOutputs["table"]["getRows"][number];

type ParsedRow = Omit<Row, "data"> & {
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

  const createdByColumn = helper.accessor("createdBy.username", {
    header: "Создал",
    cell: (ctx) => ctx.getValue(),
  });

  const updatedByColumn = helper.accessor("updatedBy.username", {
    header: "Изменил",
    cell: (ctx) => ctx.getValue(),
  });

  return [
    ...dynamicColumns,
    createdAtColumn,
    updatedAtColumn,
    createdByColumn,
    updatedByColumn,
  ];
};

const getCell = ({ value }: { type: ColumnType; value: unknown }) => {
  switch (typeof value) {
    case "string":
    case "number":
      return value;
    case "boolean":
      return value ? <Check className="size-4" /> : null;
    case "object":
      if (value instanceof Date) {
        return value.toLocaleString();
      }
      return JSON.stringify(value);
  }
};

export const getData = (data: Row[]): ParsedRow[] => {
  return data.map((row) => {
    const { data, ...rest } = row;

    return {
      ...rest,
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
    if (!serverData || columns.length === 0) return [];
    return getData(serverData);
  }, [serverData, columns]);
  console.log(data);

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
