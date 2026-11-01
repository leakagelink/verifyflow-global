import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
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
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <EnvProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <SidebarInset className="relative min-w-0 bg-transparent">
            <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
              <div className="animate-blob absolute -left-20 top-10 size-96 rounded-full bg-primary/20 blur-3xl" />
              <div className="animate-blob absolute right-0 top-1/3 size-[28rem] rounded-full bg-chart-3/20 blur-3xl [animation-delay:-6s]" />
              <div className="animate-blob absolute bottom-0 left-1/3 size-80 rounded-full bg-chart-2/15 blur-3xl [animation-delay:-12s]" />
            </div>
            <Topbar />
            <SandboxBanner />
            <main className="mx-auto w-full max-w-[1400px] flex-1 p-4 md:p-6">
              <div key={path} className="stagger">
                <Outlet />
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </EnvProvider>
  );
}
