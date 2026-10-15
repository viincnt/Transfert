import { lazy, Suspense, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Download, LoaderCircle } from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useNativeAppGuards } from "@/hooks/use-native-app-guards";
import {
  areUpdateChecksEnabled,
  checkForUpdate,
  installUpdate,
  type Update,
  UPDATE_CHECKS_CHANGED_EVENT,
} from "@/lib/updates";
import { About } from "@/pages/about";
import { Home } from "@/pages/home";
import { ImageConverter } from "@/pages/image-converter";
import { ImageOptimizer } from "@/pages/image-optimizer";
import { FileConverter } from "@/pages/file-converter";
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
  const [update, setUpdate] = useState<Update | null>(null);
  const [installingUpdate, setInstallingUpdate] = useState(false);
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

    void checkForUpdate()
      .then((latest) => {
        if (cancelled) {
          void latest?.close();
        } else if (latest) {
          setUpdate(latest);
        }
      })
      // Update checks must not prevent use when offline or GitHub is unavailable.
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [updateChecksEnabled]);

  useEffect(() => () => void update?.close(), [update]);

  async function handleInstallUpdate() {
    if (!update) return;

    setInstallingUpdate(true);
    try {
      await installUpdate(update);
    } catch {
      setInstallingUpdate(false);
    }
  }

  function dismissUpdate() {
    setUpdate(null);
  }

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
              <Route
                path="/converter/document"
                element={<FileConverter key="document" kind="document" />}
              />
              <Route
                path="/converter/audio"
                element={<FileConverter key="audio" kind="audio" />}
              />
              <Route
                path="/converter/video"
                element={<FileConverter key="video" kind="video" />}
              />
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
                Downloading and installing happens securely inside Transfert.
              </p>
              <div className="mt-6 flex flex-wrap justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={dismissUpdate}
                  disabled={installingUpdate}
                >
                  Not now
                </Button>
                <Button
                  onClick={handleInstallUpdate}
                  disabled={installingUpdate}
                >
                  {installingUpdate ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    <Download />
                  )}
                  {installingUpdate ? "Installing update" : "Install update"}
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
