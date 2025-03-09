import "server-only"; // <-- ensure this file cannot be imported from the client
import {
  createTRPCOptionsProxy,
  ResolverDef,
  TRPCQueryOptions,
} from "@trpc/tanstack-react-query";
import { cache, Suspense } from "react";
import { createTRPCContext } from "./init";
import { makeQueryClient } from "./query-client";
import { appRouter } from "./routers/_app";
import {
  dehydrate,
  FetchInfiniteQueryOptions,
  HydrationBoundary,
} from "@tanstack/react-query";
import { Loader } from "@/components/ui/loader";

export const getQueryClient = cache(makeQueryClient);
export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});

export function HydrateClient(props: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={props.fallback ?? <Loader />}>
        {props.children}
      </Suspense>
    </HydrationBoundary>
  );
}
export function prefetch<T extends ReturnType<TRPCQueryOptions<ResolverDef>>>(
  queryOptions: T
) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === "infinite") {
    void queryClient.prefetchInfiniteQuery(
      queryOptions as FetchInfiniteQueryOptions<
        unknown,
        Error,
        unknown,
        readonly unknown[],
        unknown
      >
    );
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}
