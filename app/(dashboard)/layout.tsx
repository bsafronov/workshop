import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getQueryClient, trpc } from "@/trpc/server";
import { LucideTable2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

export default async function Layout({ children }: PropsWithChildren) {
  const qc = getQueryClient();
  const { user } = await qc.fetchQuery(trpc.auth.me.queryOptions());

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>Workshop</SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Таблицы</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href={"/tables"}>
                      <LucideTable2 />
                      Мои таблицы
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter></SidebarFooter>
      </Sidebar>
      <main className="p-4 min-h-screen space-y-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <Breadcrumbs />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
