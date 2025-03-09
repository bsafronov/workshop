import { Loader } from "@/components/ui/loader";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { Client } from "./client";

type Props = {
  params: Promise<{ tableId: string }>;
};
export default async function Page({ params }: Props) {
  const { tableId } = await params;
  prefetch(trpc.table.getTable.queryOptions({ tableId }));

  return (
    <HydrateClient>
      <Suspense fallback={<Loader />}>
        <Client />
      </Suspense>
    </HydrateClient>
  );
}
