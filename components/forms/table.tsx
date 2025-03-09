"use client";

import { tableInsertSchema } from "@/db/zod";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useModal } from "../modal";
import { FormController } from "../form/controller";
import { FormInput } from "../form/input";
import { toast } from "sonner";

export const TableForm = () => {
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
