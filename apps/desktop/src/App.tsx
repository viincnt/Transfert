import { lazy, Suspense, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Download } from "lucide-react";
import { openUrl } from "@tauri-apps/plugin-opener";

import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useNativeAppGuards } from "@/hooks/use-native-app-guards";
import {
  areUpdateChecksEnabled,
  checkForUpdate,
  UPDATE_CHECKS_CHANGED_EVENT,
} from "@/lib/updates";
import { About } from "@/pages/about";
import { Home } from "@/pages/home";
import { ImageConverter } from "@/pages/image-converter";
import { ImageOptimizer } from "@/pages/image-optimizer";
import { MetadataEdit } from "@/pages/metadata-edit";
import { MetadataStrip } from "@/pages/metadata-strip";
import { Settings } from "@/pages/settings";

import { version as appVersion } from "../package.json";

// Bundles the full GPL text, so it's split into its own chunk and only
// fetched when someone actually opens the license page.
const License = lazy(() =>
  import("@/pages/license").then((m) => ({ default: m.License })),
);

function App() {
  useNativeAppGuards();
  const [update, setUpdate] = useState<{
    url: string;
    version: string;
  } | null>(null);
  const [updateChecksEnabled, setUpdateChecksEnabled] = useState(
    areUpdateChecksEnabled,
  );

  useEffect(() => {
    function syncUpdateChecksPreference() {
      const enabled = areUpdateChecksEnabled();
      setUpdateChecksEnabled(enabled);
      if (!enabled) setUpdate(null);
    }

    window.addEventListener(
      UPDATE_CHECKS_CHANGED_EVENT,
      syncUpdateChecksPreference,
    );

    return () =>
      window.removeEventListener(
        UPDATE_CHECKS_CHANGED_EVENT,
        syncUpdateChecksPreference,
      );
  }, []);

  useEffect(() => {
    if (!updateChecksEnabled) return;

    let cancelled = false;

    void checkForUpdate(appVersion)
      .then((latest) => {
        if (!cancelled && latest.available) {
          setUpdate({ url: latest.url, version: latest.version });
        }
      })
      // Update checks must not prevent use when offline or GitHub is unavailable.
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [updateChecksEnabled]);

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
              <Route path="/converter/optimizer" element={<ImageOptimizer />} />
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
        {update && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-6 backdrop-blur-sm">
            <section className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
              <p className="font-mono text-[10px] font-medium tracking-[0.14em] text-primary uppercase">
                Update available
              </p>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight">
                Transfert {update.version} is ready
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Download the latest version to get the newest improvements.
              </p>
              <div className="mt-6 flex flex-wrap justify-end gap-2">
                <Button variant="ghost" onClick={() => setUpdate(null)}>
                  Not now
                </Button>
                <Button onClick={() => openUrl(update.url)}>
                  <Download />
                  Download update
                </Button>
              </div>
            </section>
          </div>
        )}
      </SidebarProvider>
    </TooltipProvider>
  );
}

export default App;
