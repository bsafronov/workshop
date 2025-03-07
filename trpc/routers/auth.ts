import { usersTable } from "@/db/schema";
import { userInsertSchema } from "@/db/zod";
import { createSession, generateSessionToken } from "@/lib/auth";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { baseProcedure, createTRPCRouter } from "../init";

export const authRouter = createTRPCRouter({
  me: baseProcedure.query(({ ctx }) => ctx.session),
  register: baseProcedure
    .input(userInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const existedUser = await ctx.db.query.usersTable.findFirst({
        where: eq(usersTable.username, input.username),
      });

      if (existedUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists",
        });
      }

      const hashPassword = await bcrypt.hash(input.password, 10);

      const [user] = await ctx.db
        .insert(usersTable)
        .values({
          username: input.username,
          password: hashPassword,
        })
        .returning();

      const token = generateSessionToken();

      await createSession(token, user.id);

      ctx.cookieStore.set("sessionToken", token, {
        httpOnly: true,
      });
    }),
  login: baseProcedure
    .input(userInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.usersTable.findFirst({
        where: eq(usersTable.username, input.username),
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Пользователь не найден",
        });
      }

      const isValidPassword = await bcrypt.compare(
        input.password,
        user.password
      );

      if (!isValidPassword) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Неверные имя пользователя или пароль",
        });
      }

      const token = generateSessionToken();
      await createSession(token, user.id);

      ctx.cookieStore.set("sessionToken", token, {
        httpOnly: true,
      });
    }),
});
