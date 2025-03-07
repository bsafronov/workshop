import { getQueryClient, trpc } from "@/trpc/server";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

export default async function Layout({ children }: PropsWithChildren) {
  const qc = getQueryClient();

  const { user } = await qc.fetchQuery(trpc.auth.me.queryOptions());

  if (user) {
    redirect("/");
  }

  return <div className="h-screen grid place-items-center">{children}</div>;
}
