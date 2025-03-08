import { tableInsertSchema } from "@/db/zod";
import { authProcedure, createTRPCRouter } from "../init";
import { tablesTable } from "@/db/schema";
import { eq } from "drizzle-orm";

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
});
