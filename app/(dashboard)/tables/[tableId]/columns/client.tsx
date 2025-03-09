"use client";

import { DataTable } from "@/components/data-table";
import { formatRelative } from "@/lib/date";
import { useTRPC } from "@/trpc/client";
import { RouterOutputs } from "@/trpc/init";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useParams } from "next/navigation";

type Column = RouterOutputs["table"]["getColumns"][number];
const columnHelper = createColumnHelper<Column>();
const columns = [
  columnHelper.accessor("name", {
    header: "Название",
  }),
  columnHelper.accessor("createdAt", {
    header: "Дата создания",
    cell: ({ getValue }) => formatRelative(getValue()),
  }),
  columnHelper.accessor("createdBy.username", {
    header: "Создал",
  }),
  columnHelper.accessor("updatedAt", {
    header: "Дата изменения",
    cell: ({ getValue }) => {
      const date = getValue();
      if (!date) return null;

      return formatRelative(date);
    },
  }),
  columnHelper.accessor("updatedBy.username", {
    header: "Изменил",
  }),
] as ColumnDef<Column>[];

export const Client = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.table.getColumns.queryOptions({ tableId })
  );

  return <DataTable columns={columns} data={data} />;
};
