"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Page({ error }: { error: Error }) {
  useEffect(() => {
    console.log({ error });

    if (error.message === "UNAUTHORIZED") {
      redirect("/auth/login");
    }
  }, [error]);

  return (
    <div className="h-screen grid place-items-center">
      Something went wrong...
    </div>
  );
}
