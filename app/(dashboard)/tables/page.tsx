"use client";

import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <Link className={buttonVariants()} href={"/tables/12"}>
        Моя таблица
      </Link>
    </div>
  );
}
