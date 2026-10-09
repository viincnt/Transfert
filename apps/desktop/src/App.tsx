import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useNativeAppGuards } from "@/hooks/use-native-app-guards";
import { About } from "@/pages/about";
import { Home } from "@/pages/home";
import { ImageConverter } from "@/pages/image-converter";
import { MetadataEdit } from "@/pages/metadata-edit";
import { MetadataStrip } from "@/pages/metadata-strip";
import { Settings } from "@/pages/settings";

// Bundles the full GPL text, so it's split into its own chunk and only
// fetched when someone actually opens the license page.
const License = lazy(() =>
  import("@/pages/license").then((m) => ({ default: m.License })),
);

function App() {
  useNativeAppGuards();

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider className="h-svh overflow-hidden">
        <AppSidebar />
        <SidebarInset className="overflow-hidden">
          <header className="flex h-16 shrink-0 items-center border-b border-border/70 px-5">
            <span className="font-mono text-[10px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
              Local file tools
            </span>
          </header>
          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/converter/image" element={<ImageConverter />} />
              <Route path="/metadata/strip" element={<MetadataStrip />} />
              <Route path="/metadata/edit" element={<MetadataEdit />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/settings/about" element={<About />} />
              <Route
                path="/settings/about/license"
                element={
                  <Suspense fallback={null}>
                    <License />
                  </Suspense>
                }
              />
            </Routes>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}

export default App;
