"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";

export const TableList = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.table.getTableList.queryOptions());

  return (
    <ul>
      {data.map((item) => (
        <li key={item.id}>
          <Link href={`/tables/${item.id}`}>{item.name}</Link>
        </li>
      ))}
    </ul>
  );
};
