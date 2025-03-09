import { CalendarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { FormElement } from "./types";
import { format } from "date-fns";
import { useBoolean } from "usehooks-ts";
import { ru } from "date-fns/locale";

export const FormDate: FormElement<typeof Calendar> = ({
  label,
  description,
  required,
  name,
  control,
}) => {
  const { value, toggle } = useBoolean();
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel data-required={required}>{label}</FormLabel>
          <FormControl>
            <Popover open={value} onOpenChange={toggle}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button variant={"outline"}>
                    {field.value
                      ? format(field.value, "dd.MM.yyyy")
                      : "Выбрать..."}
                    <CalendarIcon className="ml-auto" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(v) => {
                    field.onChange(v);
                    toggle();
                  }}
                  initialFocus
                  locale={ru}
                />
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
