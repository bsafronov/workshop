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
        ...input,
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

      const [column] = await ctx.db
        .insert(columnsTable)
        .values({
          createdById: ctx.user.id,
          ...input,
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
        with: {
          createdBy: {
            columns: {
              id: true,
              username: true,
            },
          },
          updatedBy: {
            columns: {
              id: true,
              username: true,
            },
          },
        },
      });
    }),
  getRows: baseProcedure
    .input(z.object({ tableId: z.string() }))
    .query((opts) => {
      const { ctx, input } = opts;

      return ctx.db.query.rowsTable.findMany({
        where: eq(rowsTable.tableId, input.tableId),
        with: {
          createdBy: {
            columns: {
              id: true,
              username: true,
            },
          },
          updatedBy: {
            columns: {
              id: true,
              username: true,
            },
          },
        },
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
  deleteTable: authProcedure
    .input(
      z.object({
        tableId: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { ctx, input } = opts;

      const table = await ctx.db.query.tablesTable.findFirst({
        where: eq(tablesTable.id, input.tableId),
      });

      if (!table) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      const canDelete = table.createdById === ctx.user.id;

      if (!canDelete) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const [deletedTable] = await ctx.db
        .delete(tablesTable)
        .where(eq(tablesTable.id, input.tableId))
        .returning();

      return deletedTable;
    }),
  deleteColumn: authProcedure
    .input(
      z.object({
        columnId: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { ctx, input } = opts;

      const column = await ctx.db.query.columnsTable.findFirst({
        where: eq(tablesTable.id, input.columnId),
      });

      if (!column) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      const canDelete = column.createdById === ctx.user.id;

      if (!canDelete) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const [deletedColumn] = await ctx.db
        .delete(tablesTable)
        .where(eq(tablesTable.id, input.columnId))
        .returning();

      return deletedColumn;
    }),
  deleteRow: authProcedure
    .input(
      z.object({
        rowId: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { ctx, input } = opts;

      const row = await ctx.db.query.rowsTable.findFirst({
        where: eq(rowsTable.id, input.rowId),
      });

      if (!row) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      const canDelete = row.createdById === ctx.user.id;

      if (!canDelete) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const [deletedRow] = await ctx.db
        .delete(rowsTable)
        .where(eq(rowsTable.id, input.rowId))
        .returning();

      return deletedRow;
    }),
});
