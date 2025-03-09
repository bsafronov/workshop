"use client";

import { DataTable } from "@/components/data-table";
import { buttonVariants } from "@/components/ui/button";
import { formatRelative } from "@/lib/date";
import { useTRPC } from "@/trpc/client";
import { RouterOutputs } from "@/trpc/init";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

import { ExternalLink } from "lucide-react";
import Link from "next/link";

type TableList = RouterOutputs["table"]["getTableList"][number];

const columnHelper = createColumnHelper<TableList>();

const columns = [
  columnHelper.accessor("name", {
    header: "Название",
  }),
  columnHelper.accessor("createdAt", {
    header: "Дата создания",
    cell: ({ getValue }) => formatRelative(getValue()),
  }),
  columnHelper.accessor("createdBy.username", {
    header: "Создатель",
  }),
  columnHelper.display({
    id: "actions",
    cell: (ctx) => (
      <Link
        href={`/tables/${ctx.row.original.id}`}
        className={buttonVariants({
          variant: "outline",
          size: "icon",
        })}
      >
        <ExternalLink />
      </Link>
    ),
  }),
] as ColumnDef<TableList>[];

export const TableList = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.table.getTableList.queryOptions());

  return <DataTable columns={columns} data={data} />;
};
