import { createTRPCRouter } from "../init";
import { authRouter } from "./auth";
import { tableRouter } from "./table";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  table: tableRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
