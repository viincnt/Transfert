import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteNav />
      {children}
      <SiteFooter />
    </>
  );
}
