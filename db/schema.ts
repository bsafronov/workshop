import { sql } from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const id = uuid("id")
  .primaryKey()
  .default(sql`gen_random_uuid()`);

export const usersTable = pgTable("users", {
  id,
  username: varchar("username").notNull().unique(),
  hashPassword: varchar("hash_password").notNull(),
});
