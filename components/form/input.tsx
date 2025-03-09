import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { FormElement } from "./types";

export const FormInput: FormElement<typeof Input> = ({
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
      render={({ field: { value, ...field } }) => (
        <FormItem>
          <FormLabel data-required={required}>{label}</FormLabel>
          <FormControl>
            <Input value={value ?? ""} {...field} {...props} />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
