"use client";

import { FormController } from "@/components/form/controller";
import { FormInput } from "@/components/form/input";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { tableInsertSchema } from "@/db/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function Page() {
  return (
    <div>
      <Modal
        title="Новая таблица"
        trigger={(toggle) => <Button onClick={toggle}>Создать таблицу</Button>}
      >
        <TableForm />
      </Modal>
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

  return (
    <FormController
      form={form}
      onSubmit={form.handleSubmit((data) => console.log(data))}
    >
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
