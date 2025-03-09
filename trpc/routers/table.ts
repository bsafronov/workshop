import {
  columnInsertSchema,
  rowInsertSchema,
  tableInsertSchema,
} from "@/db/zod";
import { authProcedure, baseProcedure, createTRPCRouter } from "../init";
import { columnsTable, rowsTable, tablesTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const tableRouter = createTRPCRouter({
  createTable: authProcedure.input(tableInsertSchema).mutation(async (opts) => {
    const { ctx, input } = opts;

    const [table] = await ctx.db
      .insert(tablesTable)
      .values({
        createdById: ctx.user.id,
        name: input.name,
      })
      .returning();

    return table;
  }),
  getTableList: authProcedure.query(async (opts) => {
    const { ctx } = opts;
    const tables = await ctx.db.query.tablesTable.findMany({
      where: eq(tablesTable.createdById, ctx.user.id),
      with: {
        createdBy: true,
        updatedBy: true,
      },
    });

    return tables;
  }),
  createColumn: authProcedure
    .input(columnInsertSchema)
    .mutation(async (opts) => {
      const { ctx, input } = opts;

      const [column] = await ctx.db
        .insert(columnsTable)
        .values({
          tableId: input.tableId,
          createdById: ctx.user.id,
          type: input.type,
          name: input.name,
        })
        .returning();

      return column;
    }),
  getTable: authProcedure
    .input(
      z.object({
        tableId: z.string(),
      })
    )
    .query(async (opts) => {
      const { ctx, input } = opts;

      const table = await ctx.db.query.tablesTable.findFirst({
        where: eq(tablesTable.id, input.tableId),
        with: {
          columns: true,
        },
      });

      if (!table) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      return table;
    }),
  getColumns: baseProcedure
    .input(
      z.object({
        tableId: z.string(),
      })
    )
    .query(async (opts) => {
      const { ctx, input } = opts;

      return ctx.db.query.columnsTable.findMany({
        where: eq(columnsTable.tableId, input.tableId),
      });
    }),
  getRows: baseProcedure
    .input(z.object({ tableId: z.string() }))
    .query((opts) => {
      const { ctx, input } = opts;

      return ctx.db.query.rowsTable.findMany({
        where: eq(rowsTable.tableId, input.tableId),
      });
    }),
  createRow: authProcedure.input(rowInsertSchema).mutation(async (opts) => {
    const { ctx, input } = opts;

    const table = await ctx.db.query.tablesTable.findFirst({
      where: eq(tablesTable.id, input.tableId),
    });

    if (!table) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }

    const canCreate = table.createdById === ctx.user.id;

    if (!canCreate) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    const [row] = await ctx.db
      .insert(rowsTable)
      .values({
        createdById: ctx.user.id,
        tableId: input.tableId,
        data: input.data,
      })
      .returning();

    return row;
  }),
});
