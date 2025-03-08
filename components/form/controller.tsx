import { cn } from "@/lib/utils";
import { Send } from "lucide-react";
import { ComponentProps } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { Button } from "../ui/button";
import { Form } from "../ui/form";

type FormControllerProps<
  TFieldValues extends FieldValues,
  TContext = unknown,
  TTransformedValues extends FieldValues | undefined = undefined,
> = {
  form: UseFormReturn<TFieldValues, TContext, TTransformedValues>;
} & ComponentProps<"form"> & {
    submitText?: string;
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
  submitText = "Сохранить",
  isLoading,
  ...props
}: FormControllerProps<TFieldValues, TContext, TTransformedValues>) => {
  return (
    <Form {...form}>
      <form className={cn("space-y-8 grid", className)} {...props}>
        {children}
        {submitText && (
          <Button isLoading={isLoading} className="justify-self-end">
            <Send /> {submitText}
          </Button>
        )}
      </form>
    </Form>
  );
};
