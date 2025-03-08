import { InferSelectModel, relations, sql } from "drizzle-orm";
import {
  jsonb,
  pgEnum,
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

export const createdById = uuid("created_by")
  .notNull()
  .references(() => usersTable.id);
export const updatedById = uuid("updated_by").references(() => usersTable.id);

const base = {
  id,
  createdAt,
  updatedAt,
  updatedById,
  createdById,
};

export const usersTable = pgTable("users", {
  id,
  username: varchar("username").notNull().unique(),
  password: varchar("hash_password").notNull(),
  createdAt,
  updatedAt,
});

export const usersRelations = relations(usersTable, ({ many }) => ({
  sessions: many(sessionsTable),
}));

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

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
  }),
}));

export const tablesTable = pgTable("tables", {
  ...base,
  name: varchar("name").notNull(),
});

export const tablesRelations = relations(tablesTable, ({ many, one }) => ({
  createdBy: one(usersTable, {
    fields: [tablesTable.createdById],
    references: [usersTable.id],
    relationName: "createdBy_tables",
  }),
  updatedBy: one(usersTable, {
    fields: [tablesTable.updatedById],
    references: [usersTable.id],
    relationName: "updatedBy_tables",
  }),
  columns: many(columnsTable),
  rows: many(rowsTable),
}));

export const columnType = pgEnum("column_type", [
  "string",
  "number",
  "boolean",
  "date",
]);

export const columnsTable = pgTable("columns", {
  ...base,
  tableId: uuid("table_id")
    .notNull()
    .references(() => tablesTable.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  type: columnType("type"),
  meta: jsonb("meta").$type<Record<string, unknown>>(),
});

export const columnsRelations = relations(columnsTable, ({ one }) => ({
  createdBy: one(usersTable, {
    fields: [columnsTable.createdById],
    references: [usersTable.id],
    relationName: "createdBy_columns",
  }),
  updatedBy: one(usersTable, {
    fields: [columnsTable.updatedById],
    references: [usersTable.id],
    relationName: "updatedBy_columns",
  }),
  table: one(tablesTable, {
    fields: [columnsTable.tableId],
    references: [tablesTable.id],
  }),
}));

export const rowsTable = pgTable("rows", {
  ...base,
  tableId: uuid("table_id")
    .notNull()
    .references(() => tablesTable.id, { onDelete: "cascade" }),
  data: jsonb("data").$type<Record<string, unknown>>(),
  meta: jsonb("meta").$type<Record<string, unknown>>(),
});

export const rowsRelations = relations(rowsTable, ({ one }) => ({
  createdBy: one(usersTable, {
    fields: [rowsTable.createdById],
    references: [usersTable.id],
    relationName: "createdBy_columns",
  }),
  updatedBy: one(usersTable, {
    fields: [rowsTable.updatedById],
    references: [usersTable.id],
    relationName: "updatedBy_columns",
  }),
  table: one(tablesTable, {
    fields: [rowsTable.tableId],
    references: [tablesTable.id],
  }),
}));

export type User = InferSelectModel<typeof usersTable>;
export type Session = InferSelectModel<typeof sessionsTable>;
export type Table = InferSelectModel<typeof tablesTable>;
export type Column = InferSelectModel<typeof columnsTable>;
export type Row = InferSelectModel<typeof rowsTable>;
