"use client";

import { columnTypeLabelMap, columnTypes } from "@/const/column-type";
import { columnInsertSchema } from "@/db/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormController } from "../form/controller";
import { FormInput } from "../form/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useModal } from "../modal";
import { toast } from "sonner";
import { FormCheckbox } from "../form/checkbox";

export const ColumnForm = ({ tableId }: { tableId: string }) => {
  const form = useForm({
    defaultValues: {
      name: "",
      type: "string",
      tableId,
    },
    resolver: zodResolver(columnInsertSchema),
  });

  const trpc = useTRPC();
  const qc = useQueryClient();
  const { toggle } = useModal();
  const selectedType = form.watch("type");

  const { mutate, isPending } = useMutation(
    trpc.table.createColumn.mutationOptions({
      onSuccess: async () => {
        await qc.invalidateQueries(
          trpc.table.getColumns.queryFilter({ tableId })
        );
        toggle();
      },
      onError: (e) => toast.error(e.message),
    })
  );

  return (
    <FormController
      form={form}
      onSubmit={form.handleSubmit((data) => {
        const { type } = data;

        if (type === "boolean") {
          data.required = false;
        }

        mutate(data);
      })}
      isLoading={isPending}
    >
      <FormInput control={form.control} name="name" label="Название" required />
      <FormField
        name="type"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel data-required>Тип</FormLabel>
            <Select
              value={field.value as string}
              onValueChange={field.onChange}
            >
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выбрать..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {columnTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {columnTypeLabelMap[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      {selectedType !== "boolean" && (
        <FormCheckbox
          control={form.control}
          name="required"
          label="Обязательное поле"
        />
      )}
    </FormController>
  );
};
