import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { Edit, FilePlus } from "lucide-react";

const submitTypeMap = {
  create: {
    label: "Создать",
    icon: FilePlus,
  },
  edit: {
    label: "Изменить",
    icon: Edit,
  },
};

type FormControllerProps<
  TFieldValues extends FieldValues,
  TContext = unknown,
  TTransformedValues extends FieldValues | undefined = undefined,
> = {
  form: UseFormReturn<TFieldValues, TContext, TTransformedValues>;
} & ComponentProps<"form"> & {
    type?: keyof typeof submitTypeMap;
    isLoading?: boolean;
  };

export const FormController = <
  TFieldValues extends FieldValues,
  TContext = unknown,
  TTransformedValues extends FieldValues | undefined = undefined,
>({
  form,
  className,
  children,
  type = "create",
  isLoading,
  ...props
}: FormControllerProps<TFieldValues, TContext, TTransformedValues>) => {
  const { icon: Icon, label } = submitTypeMap[type];
  return (
    <Form {...form}>
      <form className={cn("space-y-8 grid", className)} {...props}>
        {children}

        <Button isLoading={isLoading} className="justify-self-end">
          {!isLoading && <Icon />} {label}
        </Button>
      </form>
    </Form>
  );
};
