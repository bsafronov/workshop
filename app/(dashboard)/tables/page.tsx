import { TableForm } from "@/components/forms/table";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { TableList } from "./table-list";

export default function Page() {
  prefetch(trpc.table.getTableList.queryOptions());

  return (
    <>
      <div className="flex justify-end">
        <Modal title="Новая таблица" trigger={<Button>Создать таблицу</Button>}>
          <TableForm />
        </Modal>
      </div>
      <HydrateClient>
        <TableList />
      </HydrateClient>
    </>
  );
}
