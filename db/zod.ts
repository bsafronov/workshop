import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { usersTable } from "./schema";

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
