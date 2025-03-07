"use client";

import {
  useParams,
  usePathname,
  useSearchParams,
  useSelectedLayoutSegment,
} from "next/navigation";

export default function Page() {
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const segment = useSelectedLayoutSegment();

  console.log({ params, pathname, searchParams, segment });

  return <div>Page</div>;
}
