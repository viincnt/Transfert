import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, LayoutGrid, Settings, ShieldCheck } from "lucide-react";

import { AppIcon } from "@/components/app-icon";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { toolEntries } from "@/lib/tools";

const activeItemClass =
  "data-[active=true]:bg-sidebar-primary/15 data-[active=true]:font-medium data-[active=true]:text-sidebar-foreground";

export function AppSidebar() {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <Sidebar variant="sidebar" collapsible="none">
      <SidebarHeader className="p-3 pb-2">
        <Link
          to="/"
          className="group/brand flex items-center gap-3 rounded-xl px-2 py-2 transition-colors outline-none hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm transition-transform group-hover/brand:-rotate-3">
            <AppIcon className="size-4.5" />
          </span>
          <span className="grid min-w-0 leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-semibold tracking-tight">
              {t("app.name")}
            </span>
            <span className="mt-0.5 truncate font-mono text-[9px] font-medium tracking-[0.14em] text-sidebar-foreground/55 uppercase">
              Local workspace
            </span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="px-2 font-mono text-[9px] font-medium tracking-[0.14em] uppercase">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === "/"}
                  tooltip={t("home.title")}
                  className={activeItemClass}
                >
                  <Link to="/">
                    <LayoutGrid />
                    <span>{t("home.title")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4 p-0">
          <SidebarGroupLabel className="px-2 font-mono text-[9px] font-medium tracking-[0.14em] uppercase">
            {t("nav.toolbox")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {toolEntries.map((entry) => {
                if (entry.type === "single") {
                  return (
                    <SidebarMenuItem key={entry.id}>
                      <SidebarMenuButton
                        asChild={entry.available}
                        isActive={location.pathname === entry.path}
                        disabled={!entry.available}
                        tooltip={t(entry.nameKey)}
                        className={activeItemClass}
                      >
                        {entry.available ? (
                          <Link to={entry.path}>
                            <entry.icon />
                            <span>{t(entry.nameKey)}</span>
                          </Link>
                        ) : (
                          <>
                            <entry.icon />
                            <span>{t(entry.nameKey)}</span>
                          </>
                        )}
                      </SidebarMenuButton>
                      {!entry.available && (
                        <SidebarMenuBadge>+</SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  );
                }

                const isGroupActive = entry.items.some(
                  (item) => location.pathname === item.path,
                );

                return (
                  <Collapsible
                    key={entry.id}
                    asChild
                    defaultOpen={isGroupActive || entry.id === "file-converter"}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          isActive={isGroupActive}
                          tooltip={t(entry.nameKey)}
                          className={activeItemClass}
                        >
                          <entry.icon />
                          <span>{t(entry.nameKey)}</span>
                          <ChevronRight className="ml-auto size-3.5 text-sidebar-foreground/45 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="my-1 ml-5 border-sidebar-border/75 pl-2">
                          {entry.items.map((item) => (
                            <SidebarMenuSubItem key={item.id}>
                              <SidebarMenuSubButton
                                asChild={item.available}
                                isActive={location.pathname === item.path}
                                aria-disabled={!item.available}
                                className={activeItemClass}
                              >
                                {item.available ? (
                                  <Link to={item.path}>
                                    <item.icon className="size-3.5" />
                                    <span>{t(item.nameKey)}</span>
                                  </Link>
                                ) : (
                                  <>
                                    <item.icon className="size-3.5" />
                                    <span>{t(item.nameKey)}</span>
                                  </>
                                )}
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-3 border-t border-sidebar-border/80 p-3">
        <div className="flex items-center gap-2 rounded-lg bg-sidebar-accent/65 px-2.5 py-2 group-data-[collapsible=icon]:hidden">
          <ShieldCheck className="size-3.5 shrink-0 text-sidebar-primary" />
          <span className="min-w-0 text-[11px] leading-tight text-sidebar-foreground/70">
            Runs entirely on this device
          </span>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={location.pathname === "/settings"}
              tooltip={t("nav.settings")}
              className={activeItemClass}
            >
              <Link to="/settings">
                <Settings />
                <span>{t("nav.settings")}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
