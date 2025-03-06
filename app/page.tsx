import { api, getQueryClient } from "@/trpc/server";

export default async function Page() {
  const qc = getQueryClient();
  const data = await qc.fetchQuery(api.hello.queryOptions({ text: "world" }));

  return data.greeting;
}
