import { columnType } from "@/db/schema";

export type ColumnType = (typeof columnTypes)[number] | null;

export const columnTypes = columnType.enumValues;

export const columnTypeLabelMap: Record<NonNullable<ColumnType>, string> = {
  boolean: "Да/Нет",
  date: "Дата",
  number: "Число",
  string: "Строка",
};
