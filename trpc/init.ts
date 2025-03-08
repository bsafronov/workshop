import { SessionValidationResult, validateSessionToken } from "@/lib/auth";
import {
  inferRouterInputs,
  inferRouterOutputs,
  initTRPC,
  TRPCError,
} from "@trpc/server";
import { cookies } from "next/headers";
import { cache } from "react";
import SuperJSON from "superjson";
import { AppRouter } from "./routers/_app";
import { db } from "@/db";

export const createTRPCContext = cache(async () => {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken")?.value;

  let session: SessionValidationResult = {
    session: null,
    user: null,
  };

  if (sessionToken) {
    session = await validateSessionToken(sessionToken);
  }

  return {
    user: session.user,
    session: session.session,
    db,
    cookieStore,
  };
});

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: SuperJSON,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure.use(async ({ ctx, next }) => {
  const isDev = process.env.NODE_ENV === "development";
  console.log({ ctx });

  if (isDev) {
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));
  }

  return next({ ctx });
});

export const authProcedure = baseProcedure.use(({ ctx, next }) => {
  const { session, user, db, cookieStore } = ctx;
  if (!session || !user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      cookieStore,
      db,
      session,
      user,
    },
  });
});

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
