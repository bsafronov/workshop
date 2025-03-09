import { formatRelative as fnsFormatRelative } from "date-fns";
import { ru } from "date-fns/locale";

export const formatRelative = (date: Date) => {
  return fnsFormatRelative(date, new Date(), { locale: ru });
};
