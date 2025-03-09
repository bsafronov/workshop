"use client";

import { Column } from "@/db/schema";
import { rowInsertSchema } from "@/db/zod";
import { sanitize } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormCheckbox } from "../form/checkbox";
import { FormController } from "../form/controller";
import { FormDate } from "../form/date";
import { FormInput } from "../form/input";
import { useModal } from "../modal";

const generateDataSchema = (columns?: Column[]) => {
  if (!columns) return rowInsertSchema;

  return rowInsertSchema.superRefine(({ data }, ctx) => {
    if (!data) return;

    columns.forEach((column) => {
      const { id, type, required } = column;

      if (required && type !== "boolean" && !data[id]) {
        ctx.addIssue({
          code: "custom",
          message: "Обязательное поле",
          path: ["data", id],
        });
      }
    });
  });
};

export const RowForm = ({ tableId }: { tableId: string }) => {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const { data: columns } = useQuery(
    trpc.table.getColumns.queryOptions({ tableId })
  );

  const schema = useMemo(() => generateDataSchema(columns), [columns]);

  const form = useForm({
    values: {
      tableId,
      data: {},
    },
    resolver: zodResolver(schema),
  });

  const { toggle } = useModal();

  const { mutate, isPending } = useMutation(
    trpc.table.createRow.mutationOptions({
      onSuccess: async () => {
        await qc.invalidateQueries(trpc.table.getRows.queryFilter());
        toggle();
      },
      onError: (e) => toast.error(e.message),
    })
  );

  const onSubmit = form.handleSubmit((data) => {
    const res = sanitize(data);
    mutate(res);
  });

  if (!columns) return null;

  return (
    <FormController form={form} onSubmit={onSubmit} isLoading={isPending}>
      {columns?.map((column) => {
        const { id, name, type, required } = column;
        const rowKey = `data.${id}` as const;

        switch (type) {
          case "string":
          case "number":
            return (
              <FormInput
                key={id}
                control={form.control}
                name={rowKey}
                label={name}
                required={required}
                props={{
                  type: type === "number" ? "number" : "text",
                }}
              />
            );
          case "boolean":
            return (
              <FormCheckbox
                key={id}
                control={form.control}
                name={rowKey}
                label={name}
                required={required}
              />
            );
          case "date":
            return (
              <FormDate
                control={form.control}
                key={id}
                name={rowKey}
                label={name}
                required={required}
              />
            );
        }
      })}
    </FormController>
  );
};
