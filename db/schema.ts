import { InferSelectModel, sql } from "drizzle-orm";
import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const id = uuid("id")
  .primaryKey()
  .default(sql`gen_random_uuid()`);

export const createdAt = timestamp("created_at", { mode: "date" })
  .notNull()
  .defaultNow();
export const updatedAt = timestamp("updated_at", { mode: "date" });

export const usersTable = pgTable("users", {
  id,
  username: varchar("username").notNull().unique(),
  createdAt,
  updatedAt,
});

export const sessionsTable = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export type User = InferSelectModel<typeof usersTable>;
export type Session = InferSelectModel<typeof sessionsTable>;
