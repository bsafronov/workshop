import { ComponentProps } from "react";
import { ControllerProps, FieldPath, FieldValues } from "react-hook-form";

type FormElementProps<
  TComponent extends React.ElementType,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  label?: string;
  description?: string;
  required?: boolean;
  props?: ComponentProps<TComponent>;
} & Pick<ControllerProps<TFieldValues, TName>, "name" | "control">;

export type FormElement<TComponent extends React.ElementType> = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: FormElementProps<TComponent, TFieldValues, TName>
) => React.ReactNode;
