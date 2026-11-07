"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import {
  ArrowRight,
  Check,
  Folder,
  Image as ImageIcon,
  MapPin,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  categories,
  examples,
  photoCrops,
  type Category,
} from "../lib/examples";
import Select from "./select";
import Switch from "./switch";

const icon = { strokeWidth: 1.5, "aria-hidden": true };
const panel =
  "bg-surface rounded-[10px] text-ui shadow-[0_16px_48px_#0009]"; /* taste-skill-ignore: interface panel floating over a photo */

function useFirstInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setSeen(true);
      },
      { threshold: 0.4 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, inView, seen };
}

const prefersReduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function FileTile({
  extension,
  accent,
  Glyph,
}: {
  extension: string;
  accent?: boolean;
  Glyph: (typeof examples)[Category]["icon"];
}) {
  return (
    <div
      className={`flex h-[116px] w-[88px] flex-col items-center justify-center gap-3 [clip-path:polygon(0_0,74%_0,100%_20%,100%_100%,0_100%)] ${
        accent ? "bg-accent text-bg" : "bg-chip text-ink"
      }`}
    >
      <Glyph {...icon} size={28} />
      <span className="font-medium tabular-nums">{extension}</span>
    </div>
  );
}

const CYCLE_MS = 2800;

/** Cycles through the file types while on screen, until someone picks one. */
export function FormatFragment() {
  const t = useTranslations("formatFragment");
  const tEx = useTranslations("examples");
  const { ref, inView } = useFirstInView<HTMLDivElement>();
  const [index, setIndex] = useState(0);
  const [pinned, setPinned] = useState(false);
  const [reduced, setReduced] = useState(false);
  const category = categories[index];
  const data = examples[category];
  const running = inView && !pinned && !reduced;
  const fileNames = tEx.raw(`files.${category}`) as string[];

  useEffect(() => setReduced(prefersReduced()), []);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(
      () => setIndex((value) => (value + 1) % categories.length),
      CYCLE_MS,
    );
    return () => clearInterval(timer);
  }, [running]);

  return (
    <div ref={ref} className={`${panel} w-full max-w-[420px] p-1.5`} data-ui>
      <div
        className="grid grid-cols-4 gap-0.5"
        role="group"
        aria-label={t("groupLabel")}
      >
        {categories.map((item, itemIndex) => {
          const pressed = itemIndex === index;
          const label = tEx(`categories.${item}`);
          return (
            <button
              key={item}
              type="button"
              aria-pressed={pressed}
              onClick={() => {
                setIndex(itemIndex);
                setPinned(true);
              }}
              className={`relative h-9 truncate rounded-[7px] px-1 transition-colors duration-150 ${
                pressed ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {pressed && (
                <motion.span
                  layoutId="format-tab"
                  className="bg-chip absolute inset-0 rounded-[7px]"
                  transition={{ type: "spring", duration: 0.45, bounce: 0 }}
                />
              )}
              <span className="relative z-10">{label}</span>
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-5 pt-7 pb-5">
        <div className="fade-in" key={`from-${category}`}>
          <FileTile extension={data.extension} Glyph={data.icon} />
        </div>
        <ArrowRight {...icon} size={22} className="text-muted" />
        <div className="pop" key={`to-${category}`}>
          <FileTile extension={data.formats[0]} Glyph={data.icon} accent />
        </div>
      </div>
      <p
        className="fade-in text-muted pb-4 text-center"
        key={`name-${category}`}
      >
        <span className="text-ink">
          {fileNames[0]}.{data.formats[0].toLowerCase()}
        </span>{" "}
        · {t("sameContent")}
      </p>
      <div className="bg-raised mx-2 mb-2 h-0.5 overflow-clip rounded-full">
        {running && (
          <i
            key={category}
            className="tick bg-accent block h-full"
            style={{ "--cycle": `${CYCLE_MS}ms` } as React.CSSProperties}
          />
        )}
      </div>
    </div>
  );
}

/** The real inspector idea: flip a field off and it leaves the photo. */
export function MetadataFragment() {
  const t = useTranslations("metadataFragment");
  const { ref, seen } = useFirstInView<HTMLDivElement>();

  const fields = t.raw("fields") as Array<{ name: string; value: string }>;
  const startRemoved = [true, false, true, false];

  const [removed, setRemoved] = useState<boolean[]>(fields.map(() => false));
  const touched = useRef(false);
  const count = removed.filter(Boolean).length;

  useEffect(() => {
    if (!seen || touched.current) return;
    const timers = fields.flatMap((_, index) =>
      startRemoved[index]
        ? [
            setTimeout(
              () =>
                setRemoved((current) =>
                  current.map((value, i) => (i === index ? true : value)),
                ),
              prefersReduced() ? 0 : 700 + index * 350,
            ),
          ]
        : [],
    );
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen]);

  const countLabel =
    count === 0
      ? t("nothingRemoved")
      : count === 1
        ? t("oneRemoved")
        : t("manyRemoved", { count });

  return (
    <div ref={ref} className={`${panel} w-full max-w-[420px]`} data-ui>
      <div className="flex items-center gap-3 p-3">
        <div className="bg-chip relative size-11 shrink-0 overflow-clip rounded-[7px]">
          <Image
            src="/mountains.jpg"
            alt=""
            fill
            sizes="88px"
            className="scale-[2] object-cover"
          />
          <span
            className={`bg-accent text-bg absolute inset-0 m-auto grid size-5 place-items-center rounded-full transition-[opacity,transform] duration-300 ease-(--ease-out) ${
              removed[0] ? "scale-50 opacity-0" : ""
            }`}
          >
            <MapPin {...icon} size={12} />
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate">trip.jpg</p>
          <p className="text-muted tabular-nums" aria-live="polite">
            {countLabel}
          </p>
        </div>
      </div>
      <dl className="m-0 px-3 pb-2">
        {fields.map(({ name, value }, index) => (
          <div
            key={name}
            className="border-line flex items-center justify-between gap-3 border-t py-2.5" /* taste-skill-ignore: row separator inside the inspector */
          >
            <div className="min-w-0">
              <dt className="text-muted">{name}</dt>
              <dd
                className={`relative m-0 w-fit truncate transition-colors duration-200 ${
                  removed[index] ? "text-muted" : "text-ink"
                }`}
              >
                {value}
                <i
                  className={`bg-muted absolute inset-x-0 top-1/2 block h-px origin-left transition-transform duration-300 ease-(--ease-out) ${removed[index] ? "scale-x-100" : "scale-x-0"}`} /* taste-skill-ignore: strike through a removed value */
                />
              </dd>
            </div>
            <Switch
              label={t("removeLabel", { name })}
              checked={removed[index]}
              onChange={(checked) => {
                touched.current = true;
                setRemoved((current) =>
                  current.map((item, i) => (i === index ? checked : item)),
                );
              }}
            />
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Batch preset selector and run animation. */
export function BatchFragment() {
  const t = useTranslations("batchFragment");
  const tEx = useTranslations("examples");
  const presetsRaw = t.raw("presets") as Record<
    string,
    { format: string; verb: string }
  >;
  const presetKeys = Object.keys(presetsRaw);
  const fileNames = tEx.raw("files.images") as string[];
  const batch = fileNames.map((name, index) => ({
    name,
    crop: photoCrops[index],
  }));

  const [preset, setPreset] = useState(presetKeys[0]);
  const [run, setRun] = useState<"idle" | "running" | "done">("idle");
  const { format, verb } = presetsRaw[preset];

  const FILL_MS = 520;
  const STEP_MS = 240;

  useEffect(() => {
    if (run !== "running") return;
    const timer = setTimeout(
      () => setRun("done"),
      prefersReduced() ? 0 : FILL_MS + STEP_MS * (batch.length - 1),
    );
    return () => clearTimeout(timer);
  }, [run, batch.length]);

  return (
    <div className={`${panel} w-full max-w-[420px] p-3`} data-ui>
      <Select
        label={t("presetLabel")}
        value={preset}
        options={presetKeys}
        onChange={(value) => {
          setPreset(value);
          setRun("idle");
        }}
      />
      <div className="mt-3 grid gap-1">
        {batch.map(({ name, crop }, index) => (
          <div
            key={name}
            className="bg-raised relative flex items-center gap-3 overflow-clip rounded-[7px] p-1.5 pr-3"
          >
            <i
              className={`bg-accent/12 absolute inset-0 block origin-left transition-transform ease-(--ease-out) motion-reduce:transition-none ${
                run === "idle" ? "scale-x-0 duration-150" : "scale-x-100"
              }`}
              style={
                run === "idle"
                  ? undefined
                  : {
                      transitionDuration: `${FILL_MS}ms`,
                      transitionDelay: `${index * STEP_MS}ms`,
                    }
              }
            />
            <div className="bg-chip relative size-8 shrink-0 overflow-clip rounded-[5px]">
              <Image
                src="/mountains.jpg"
                alt=""
                fill
                sizes="64px"
                className={`scale-[2.2] object-cover ${crop}`}
              />
            </div>
            <span className="relative min-w-0 flex-1 truncate">
              {name}.{run === "done" ? format.toLowerCase() : "heic"}
            </span>
            {run === "done" ? (
              <Check {...icon} size={16} className="text-accent pop relative" />
            ) : (
              <span className="text-muted relative tabular-nums">{format}</span>
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 flex min-h-[42px] items-center justify-between gap-3">
        <span
          className="text-muted flex min-w-0 items-center gap-2"
          aria-live="polite"
        >
          {run === "done" ? (
            <>
              <Folder {...icon} size={17} className="text-accent" />
              <span className="fade-in">{t("readyFor", { verb })}</span>
            </>
          ) : (
            t("fileCount")
          )}
        </span>
        <button
          type="button"
          disabled={run === "running"}
          onClick={() => setRun(run === "idle" ? "running" : "idle")}
          className="button-primary !text-ui !min-h-10 disabled:cursor-progress disabled:opacity-70"
        >
          {run === "running"
            ? t("runRunning")
            : run === "done"
              ? t("runDone")
              : t("runIdle")}
        </button>
      </div>
    </div>
  );
}
