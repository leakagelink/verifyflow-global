import { useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import { navGroups } from "./nav";
import { Logo } from "./logo";

export function AppSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { setOpenMobile } = useSidebar();
  useEffect(() => setOpenMobile(false), [path, setOpenMobile]);
  const isActive = (url: string) => (url === "/app" ? path === "/app" || path === "/app/" : path === url || path.startsWith(url + "/"));
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-14 justify-center border-b border-sidebar-border text-sidebar-accent-foreground">
        <Link to="/" className="flex items-center gap-2 px-1"><Logo /></Link>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((g, gi) => (
          <SidebarGroup key={gi} className="py-1">
            {g.label && <SidebarGroupLabel className="text-[11px] uppercase tracking-wider">{g.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title} className="h-8 data-[active=true]:font-medium">
                      <Link to={item.url}><item.icon /><span>{item.title}</span></Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t group-data-[collapsible=icon]:hidden">
        <div className="rounded-lg bg-sidebar-accent p-3 text-xs text-sidebar-accent-foreground">
          <div className="flex items-center gap-1.5 font-medium"><span className="size-1.5 rounded-full bg-success" />All systems operational</div>
          <div className="mt-0.5 opacity-70">Upstream latency 182ms</div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
