import { Checkbox } from "../ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { FormElement } from "./types";

export const FormCheckbox: FormElement<typeof Checkbox> = ({
  label,
  description,
  required,
  name,
  control,
  props,
}) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field: { value, onChange, ...field } }) => (
        <FormItem>
          <div className="flex items-center gap-2">
            <FormControl>
              <Checkbox
                {...field}
                checked={value ?? false}
                onCheckedChange={onChange}
                {...props}
              />
            </FormControl>
            <FormLabel data-required={required}>{label}</FormLabel>
          </div>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
