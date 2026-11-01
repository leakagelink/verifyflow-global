import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Topbar } from "@/components/layout/topbar";
import { EnvProvider, useEnv } from "@/components/layout/env-context";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function SandboxBanner() {
  const { live } = useEnv();
  if (live) return null;
  return (
    <div className="border-b border-warning/30 bg-warning/10 px-4 py-1.5 text-center text-xs font-medium text-warning-foreground dark:text-warning">
      Sandbox mode — requests use test keys and no credits are charged.
    </div>
  );
}

function AppLayout() {
  return (
    <EnvProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <SidebarInset className="min-w-0 bg-background">
            <Topbar />
            <SandboxBanner />
            <main className="mx-auto w-full max-w-[1400px] flex-1 p-4 md:p-6">
              <Outlet />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </EnvProvider>
  );
}
