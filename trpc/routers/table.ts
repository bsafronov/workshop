import { columnInsertSchema, tableInsertSchema } from "@/db/zod";
import { authProcedure, createTRPCRouter } from "../init";
import { columnsTable, tablesTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const tableRouter = createTRPCRouter({
  createTable: authProcedure
    .input(tableInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const [table] = await ctx.db
        .insert(tablesTable)
        .values({
          createdById: ctx.user.id,
          name: input.name,
        })
        .returning();

      return table;
    }),
  getTableList: authProcedure.query(async ({ ctx }) => {
    const tables = await ctx.db.query.tablesTable.findMany({
      where: eq(tablesTable.createdById, ctx.user.id),
    });

    return tables;
  }),
  createColumn: authProcedure
    .input(columnInsertSchema)
    .mutation(async ({ ctx, input }) => {
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
    .query(async ({ ctx, input }) => {
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
});
