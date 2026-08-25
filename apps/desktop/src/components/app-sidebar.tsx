import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Settings } from "lucide-react";

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

export function AppSidebar() {
  const { t } = useTranslation();
  const location = useLocation();

  // Picked once per app boot, stays put while navigating around.
  const [tagline] = useState(() => {
    const taglines = t("app.taglines", { returnObjects: true }) as string[];
    return taglines[Math.floor(Math.random() * taglines.length)];
  });

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <AppIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {t("app.name")}
                  </span>
                  <span className="truncate text-xs text-sidebar-foreground/70">
                    {tagline}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("nav.toolbox")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolEntries.map((entry) => {
                if (entry.type === "single") {
                  return (
                    <SidebarMenuItem key={entry.id}>
                      <SidebarMenuButton
                        asChild={entry.available}
                        isActive={location.pathname === entry.path}
                        disabled={!entry.available}
                        tooltip={t(entry.nameKey)}
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
                        <SidebarMenuBadge>
                          {t("tools.comingSoon")}
                        </SidebarMenuBadge>
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
                        >
                          <entry.icon />
                          <span>{t(entry.nameKey)}</span>
                          <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {entry.items.map((item) => (
                            <SidebarMenuSubItem key={item.id}>
                              <SidebarMenuSubButton
                                asChild={item.available}
                                isActive={location.pathname === item.path}
                                aria-disabled={!item.available}
                              >
                                {item.available ? (
                                  <Link to={item.path}>
                                    <item.icon />
                                    <span>{t(item.nameKey)}</span>
                                  </Link>
                                ) : (
                                  <>
                                    <item.icon />
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
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={location.pathname === "/settings"}
              tooltip={t("nav.settings")}
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
