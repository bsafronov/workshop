"use client";

import { FormController } from "@/components/form/controller";
import { FormInput } from "@/components/form/input";
import { Modal, useModal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { tableInsertSchema } from "@/db/zod";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function Page() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.table.getTableList.queryOptions());

  return (
    <div>
      <div className="flex justify-end">
        <Modal
          title="Новая таблица"
          trigger={(toggle) => (
            <Button onClick={toggle}>Создать таблицу</Button>
          )}
        >
          <TableForm />
        </Modal>
      </div>
      <ul className="">
        {data?.map((item) => (
          <li key={item.id}>
            <Link href={`/tables/${item.id}`}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const TableForm = () => {
  const form = useForm({
    defaultValues: {
      name: "",
      isTest: false,
    },
    resolver: zodResolver(
      tableInsertSchema.and(
        z.object({
          isTest: z.boolean(),
        })
      )
    ),
  });

  const trpc = useTRPC();
  const qc = useQueryClient();
  const { toggle } = useModal();
  const { mutate, isPending } = useMutation(
    trpc.table.createTable.mutationOptions({
      onSuccess: async () => {
        await qc.invalidateQueries(trpc.table.getTableList.queryFilter());
        toggle();
      },
      onError: (e) => toast.error(e.message),
    })
  );

  const onSubmit = form.handleSubmit((data) => mutate(data));

  return (
    <FormController form={form} onSubmit={onSubmit} isLoading={isPending}>
      <FormInput
        control={form.control}
        name="name"
        label="Название"
        description="Описание"
        required
      />
    </FormController>
  );
};
