import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Client } from "./client";

type Props = {
  params: Promise<{ tableId: string }>;
};
export default async function Page({ params }: Props) {
  const { tableId } = await params;
  prefetch(trpc.table.getColumns.queryOptions({ tableId }));

  return (
    <HydrateClient>
      <Client />
    </HydrateClient>
  );
}
