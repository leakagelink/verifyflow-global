import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

const { setOpenMobile } = vi.hoisted(() => ({ setOpenMobile: vi.fn() }));

vi.mock("@tanstack/react-router", () => ({
  useRouterState: () => "/app",
  Link: ({ to, children, onClick }: { to: string; children: ReactNode; onClick?: () => void }) => (
    <a href={to} onClick={(event) => { event.preventDefault(); onClick?.(); }}>{children}</a>
  ),
}));

vi.mock("@/components/ui/sidebar", () => {
  const Wrapper = ({ children }: { children: ReactNode }) => <div>{children}</div>;
  return {
    useSidebar: () => ({ setOpenMobile }),
    Sidebar: Wrapper, SidebarContent: Wrapper, SidebarFooter: Wrapper,
    SidebarGroup: Wrapper, SidebarGroupContent: Wrapper, SidebarGroupLabel: Wrapper,
    SidebarHeader: Wrapper, SidebarMenu: Wrapper, SidebarMenuButton: Wrapper, SidebarMenuItem: Wrapper,
  };
});
vi.mock("@/components/layout/logo", () => ({ Logo: () => <span>Numora</span> }));

import { AppSidebar } from "@/components/layout/app-sidebar";

afterEach(() => { cleanup(); vi.clearAllMocks(); });

describe("Mobile sidebar navigation", () => {
  it("closes on every selection, including the current page", () => {
    render(<AppSidebar />);
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(1);
    setOpenMobile.mockClear();
    for (const link of links) {
      fireEvent.click(link);
      expect(setOpenMobile).toHaveBeenLastCalledWith(false);
      setOpenMobile.mockClear();
    }
  });
});