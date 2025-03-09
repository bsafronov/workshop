"use client";

import { Confirm } from "@/components/confirm";
import { DynamicDataTable } from "@/components/data-table";
import { ColumnForm } from "@/components/forms/column";
import { RowForm } from "@/components/forms/row";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export const Client = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const trpc = useTRPC();
  const qc = useQueryClient();
  const { push } = useRouter();
  const { data: table } = useSuspenseQuery(
    trpc.table.getTable.queryOptions({ tableId })
  );

  const { mutate, isPending } = useMutation(
    trpc.table.deleteTable.mutationOptions({
      onSuccess: async () => {
        await qc.invalidateQueries(trpc.table.getTableList.queryFilter());
        push("/tables");
      },
      onError: (e) => toast.error(e.message),
    })
  );

  return (
    <>
      <div className="flex justify-end gap-2">
        <Modal
          title="Новый столбец"
          trigger={<Button>Добавить столбец</Button>}
        >
          <ColumnForm tableId={table.id} />
        </Modal>
        <Modal title="Новая запись" trigger={<Button>Добавить запись</Button>}>
          <RowForm tableId={table.id} />
        </Modal>
        <Confirm onSubmit={() => mutate({ tableId })}>
          <Button isLoading={isPending} variant={"destructive"}>
            Удалить таблицу
          </Button>
        </Confirm>
      </div>
      <DynamicDataTable tableId={tableId} />
    </>
  );
};
