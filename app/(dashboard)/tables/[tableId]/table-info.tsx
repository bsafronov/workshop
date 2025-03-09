"use client";

import { DynamicDataTable } from "@/components/data-table";
import { ColumnForm } from "@/components/forms/column";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export const TableInfo = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const trpc = useTRPC();
  const { data: table } = useSuspenseQuery(
    trpc.table.getTable.queryOptions({ tableId })
  );

  return (
    <>
      <div className="flex justify-end">
        <Modal
          title="Новый столбец"
          trigger={<Button>Добавить столбец</Button>}
        >
          <ColumnForm tableId={table.id} />
        </Modal>
      </div>
      <DynamicDataTable tableId={tableId} />
    </>
  );
};
