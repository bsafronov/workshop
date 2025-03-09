"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import Link from "next/link";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

const breadcrumbNamesMap: Record<string, string> = {
  tables: "Таблицы",
  settings: "Настройки",
  columns: "Столбцы",
};

export const Breadcrumbs = () => {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {paths.map((path, index) => {
          const url = "/" + paths.slice(0, index + 1).join("/");

          return (
            <Fragment key={path}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href={url}
                    className={cn(pathname === url && "text-primary")}
                  >
                    {breadcrumbNamesMap[path] ?? path}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index < paths.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
