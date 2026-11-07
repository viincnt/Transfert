import { getTranslations } from "next-intl/server";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Lock,
  ShieldCheck,
  type LucideProps,
} from "lucide-react";
import DriftingPhoto from "./components/drifting-photo";
import Faq from "./components/faq";
import {
  BatchFragment,
  FormatFragment,
  MetadataFragment,
} from "./components/fragments";

import Heading from "./components/heading";
import OpeningWindow from "./components/opening-window";
import ProductDemo from "./components/product-demo";
import SiteNav from "./components/site-nav";

const icon: LucideProps = { strokeWidth: 1.5, "aria-hidden": true };

const footerLink =
  "underline decoration-transparent transition-colors duration-200 hover:decoration-current";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

const principleIcons = [Lock, Check, ShieldCheck];
const featureFragments = [FormatFragment, MetadataFragment, BatchFragment];
const featurePhotos = [
  "object-[30%_20%]",
  "object-[70%_55%]",
  "object-[45%_100%]",
];

export default async function Home() {
  const t = await getTranslations();

  const features = (
    t.raw("features.items") as Array<{
      title: string;
      body: string;
      note: string;
    }>
  ).map((item, index) => ({
    ...item,
    Fragment: featureFragments[index],
    photo: featurePhotos[index],
  }));

  const principles = (
    t.raw("privacy.principles") as Array<{ title: string; body: string }>
  ).map((item, index) => ({ ...item, Icon: principleIcons[index] }));

  return (
    <>
      <a
        className="bg-accent text-bg fixed top-[-100px] left-4 z-[60] rounded-[8px] p-3.5 focus:top-3"
        href="#content"
      >
        {t("nav.skipToContent")}
      </a>
      <SiteNav />
      <main id="content" className="pt-(--nav)">
        <section id="home">
          <div className="frame pt-16 pb-12 text-center md:pt-[clamp(64px,10vh,96px)] md:pb-16">
            <Heading
              as="h1"
              lead={t("hero.lead")}
              rest={t("hero.rest")}
              className="text-display leading-[1.02] tracking-[-0.035em]"
            />
            <p
              className="hero-rise text-muted text-lead mx-auto mt-5 max-w-[50ch]"
              style={delay(320)}
            >
              {t("hero.subtitle")}
            </p>
            <div
              className="hero-rise mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
              style={delay(400)}
            >
              <a className="group button-primary" href="#demo">
                {t("hero.cta")}
                <ArrowRight {...icon} size={17} className="arrow" />
              </a>
              <a
                className="hover:text-accent flex min-h-11 items-center font-medium transition-colors duration-200"
                href="#features"
              >
                {t("hero.secondary")}
              </a>
            </div>
            <span
              className="hero-rise text-muted text-ui mt-5 flex items-center justify-center gap-2"
              style={delay(460)}
            >
              <span className="bg-accent inline-block size-[5px] shrink-0 rounded-full" />
              {t("hero.badge")}
            </span>
          </div>
        </section>

        <section id="demo" aria-label={t("demo.sectionLabel")}>
          <OpeningWindow>
            <ProductDemo />
          </OpeningWindow>
          <div className="frame text-muted text-ui mt-4 flex flex-col gap-1 md:flex-row md:justify-between md:gap-5">
            <span>{t("demo.caption")}</span>
            <span>{t("demo.disclaimer")}</span>
          </div>
        </section>

        <section className="frame pt-24 md:pt-36" id="features">
          <div className="mb-8 md:mb-12">
            <Heading
              lead={t("features.lead")}
              rest={t("features.rest")}
              className="text-head"
            />
            <p
              className="text-muted mt-4 max-w-[58ch]"
              data-reveal="rise"
              style={delay(160)}
            >
              {t("features.intro")}
            </p>
          </div>
          <div className="grid gap-3">
            {features.map(({ title, body, note, Fragment, photo }, index) => (
              <article
                key={title}
                data-reveal="rise"
                style={{ top: `calc(var(--nav) + ${16 + index * 12}px)` }}
                className="bg-surface grid gap-2 rounded-[16px] p-2 md:grid-cols-2 [@media(min-width:768px)_and_(min-height:680px)]:sticky"
              >
                <div
                  className={`relative flex min-h-[420px] items-center justify-center overflow-clip rounded-[10px] bg-[#3f5c78] p-4 md:min-h-[500px] md:p-8 ${
                    index % 2 ? "md:order-2" : ""
                  }`}
                >
                  <DriftingPhoto
                    sizes="(min-width: 768px) 540px, 100vw"
                    className={photo}
                  />
                  <div className="relative flex w-full justify-center">
                    <Fragment />
                  </div>
                </div>
                <div className="self-center px-4 pt-6 pb-8 md:px-10 md:py-8">
                  <h3 className="text-title leading-[1.2] tracking-[-0.02em]">
                    {title}
                  </h3>
                  <p className="text-muted mt-3 max-w-[42ch]">{body}</p>
                  <span className="text-ui mt-5 flex items-center gap-2">
                    <Check {...icon} size={16} className="text-accent" />
                    {note}
                  </span>
                </div>
              </article>
            ))}
          </div>
          <p className="text-muted text-ui mt-4">{t("features.disclaimer")}</p>
        </section>

        <section className="frame pt-24 md:pt-36" id="privacy">
          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
            <div>
              <Heading
                lead={t("privacy.lead")}
                rest={t("privacy.rest")}
                className="text-head"
              />
              <p
                className="text-muted mt-4 max-w-[46ch]"
                data-reveal="rise"
                style={delay(160)}
              >
                {t("privacy.body")}
              </p>
            </div>
            <div
              className="relative aspect-[16/10] overflow-clip rounded-[14px] bg-[#3f5c78]"
              data-reveal="rise"
            >
              <DriftingPhoto
                alt={t("privacy.photoAlt")}
                sizes="(min-width: 768px) 520px, 100vw"
                className="object-[60%_0%]"
              />
            </div>
          </div>
          <ul
            className="mt-8 grid list-none gap-3 p-0 md:mt-12 md:grid-cols-3"
            data-reveal="rows"
          >
            {principles.map(({ Icon, title, body }) => (
              <li key={title} className="bg-surface rounded-[12px] p-5">
                <Icon {...icon} size={20} className="text-accent" />
                <h3 className="text-lead mt-4 leading-[1.3] tracking-[-0.015em]">
                  {title}
                </h3>
                <p className="text-muted mt-1.5">{body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="frame grid gap-6 pt-24 md:grid-cols-12 md:gap-8 md:pt-36"
          id="faq"
        >
          <div className="md:col-span-5">
            <Heading
              lead={t("faq.lead")}
              rest={t("faq.rest")}
              className="text-head"
            />
            <p
              className="text-muted mt-4"
              data-reveal="rise"
              style={delay(160)}
            >
              {t("faq.subtitle")}
            </p>
          </div>
          <Faq />
        </section>

        <section className="frame pt-24 md:pt-36" id="availability">
          <div className="relative overflow-clip rounded-[16px] bg-[#1d2a1c] px-6 py-20 text-center md:py-28">
            <DriftingPhoto
              sizes="(min-width: 1144px) 1080px, 100vw"
              className="object-[50%_100%]"
            />
            <div className="bg-bg/60 absolute inset-0" />
            <div className="relative">
              <span className="text-ui flex items-center justify-center gap-2">
                <span className="bg-accent inline-block size-[5px] shrink-0 rounded-full" />
                {t("cta.badge")}
              </span>
              <h2 className="text-head mt-4" data-reveal="rise">
                {t("cta.lead")} <br className="max-sm:hidden" />
                {t("cta.rest")}
              </h2>
              <p
                className="mx-auto mt-4 max-w-[46ch]"
                data-reveal="rise"
                style={delay(120)}
              >
                {t("cta.body")}
              </p>
              <div className="mt-7" data-reveal="rise" style={delay(200)}>
                <a className="group button-primary" href="#demo">
                  {t("cta.button")}
                  <ArrowRight {...icon} size={17} className="arrow" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="frame mt-16 pb-10 md:mt-24">
        {/* wordmark row */}
        <div className="border-line flex flex-col gap-10 border-t pt-10 pb-12 sm:flex-row sm:items-start sm:justify-between md:pb-16">
          <div>
            <a
              href="#home"
              className="inline-flex items-center gap-2.5 text-[1.75rem] leading-none tracking-[-0.03em] md:text-[2rem]"
              aria-label="Transfert, home"
            >
              Transfert
            </a>
            <p className="text-muted text-ui mt-3 max-w-[28ch]">
              Your files. Your way. Local, free and open.
            </p>
          </div>

          {/* link columns */}
          <div className="flex gap-12 sm:gap-16">
            <div className="flex flex-col gap-2.5">
              <span className="text-muted text-ui mb-1">Product</span>
              <a
                href="#features"
                className="text-ui text-muted hover:text-ink transition-colors duration-150"
              >
                Features
              </a>
              <a
                href="#privacy"
                className="text-ui text-muted hover:text-ink transition-colors duration-150"
              >
                Privacy
              </a>
              <a
                href="#faq"
                className="text-ui text-muted hover:text-ink transition-colors duration-150"
              >
                FAQ
              </a>
              <a
                href="#demo"
                className="text-ui text-muted hover:text-ink transition-colors duration-150"
              >
                Demo
              </a>
              <Link
                href="/download"
                className="text-ui text-muted hover:text-ink transition-colors duration-150"
              >
                Download
              </Link>
            </div>
            <div className="flex flex-col gap-2.5">
              <span className="text-muted text-ui mb-1">Legal</span>
              <Link
                href="/privacy"
                className="text-ui text-muted hover:text-ink transition-colors duration-150"
              >
                Privacy policy
              </Link>
              <Link
                href="/terms"
                className="text-ui text-muted hover:text-ink transition-colors duration-150"
              >
                Terms of use
              </Link>
              <a
                href="https://github.com/viincnt/Transfert"
                target="_blank"
                rel="noreferrer"
                className="text-ui text-muted hover:text-ink inline-flex items-center gap-1 transition-colors duration-150"
              >
                GitHub
                <ArrowRight
                  {...icon}
                  size={12}
                  className="-rotate-45 opacity-40"
                />
              </a>
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="border-line text-ui text-muted flex flex-wrap items-center gap-x-4 gap-y-1 border-t pt-5">
          <span>
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </span>
          <span aria-hidden="true" className="opacity-30">
            ·
          </span>
          <span>{t("footer.license")}</span>
          <span aria-hidden="true" className="opacity-30">
            ·
          </span>
          <a
            className="hover:text-ink transition-colors duration-150"
            href="https://unsplash.com/photos/oMpAz-DN-9I"
            target="_blank"
            rel="noreferrer"
          >
            {t("footer.photo")}
          </a>
        </div>
      </footer>
    </>
  );
}
