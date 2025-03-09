import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { util } from "zod";
import { columnsTable, rowsTable, tablesTable, usersTable } from "./schema";

type OmitKeys =
  | "id"
  | "createdAt"
  | "updatedAt"
  | "updatedById"
  | "createdById";

type OmitRecord = {
  [key in OmitKeys]?: true;
};

const insertOmit: util.Exactly<OmitRecord, unknown> = {
  id: true,
  createdAt: true,
  updatedAt: true,
  updatedById: true,
  createdById: true,
};

export const userSelectSchema = createSelectSchema(usersTable);
export const userInsertSchema = createInsertSchema(usersTable, {
  username: (s) =>
    s.nonempty("Обязательное поле").min(3, "Слишком короткое имя пользователя"),
  password: (s) => s.nonempty("Обязательное поле"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const tableInsertSchema =
  createInsertSchema(tablesTable).omit(insertOmit);

export const columnInsertSchema = createInsertSchema(columnsTable, {
  name: (s) => s.nonempty("Обязательное поле"),
}).omit(insertOmit);

export const rowInsertSchema = createInsertSchema(rowsTable).omit(insertOmit);
