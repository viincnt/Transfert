"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import {
  ArrowRight,
  Check,
  Lock,
  ShieldCheck,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  categories,
  examples,
  photoCrops,
  type Category,
} from "../lib/examples";
import BrandIcon from "./brand-icon";
import Select from "./select";
import Switch from "./switch";

const icon: LucideProps = { strokeWidth: 1.5, "aria-hidden": true };

type Run = "idle" | "running" | "done";

const FILL_MS = 700;
const STAGGER_MS = 160;

function Thumbnail({
  category,
  index,
  done,
  icon: ItemIcon,
}: {
  category: Category;
  index: number;
  done: boolean;
  icon: LucideIcon;
}) {
  return (
    <div className="bg-chip text-accent relative grid size-9 shrink-0 place-items-center overflow-clip rounded-[5px] md:size-10">
      {category === "images" && (
        <Image
          src="/mountains.jpg"
          alt=""
          fill
          sizes="160px"
          className={`scale-[2.2] object-cover ${photoCrops[index]}`}
        />
      )}
      {done ? (
        <span
          key="done"
          className="bg-accent text-bg pop relative grid size-6 place-items-center rounded-full"
        >
          <Check {...icon} size={15} />
        </span>
      ) : (
        category !== "images" && <ItemIcon {...icon} size={19} />
      )}
    </div>
  );
}

export default function ProductDemo() {
  const t = useTranslations("productDemo");
  const tEx = useTranslations("examples");
  const [category, setCategory] = useState<Category>("images");
  const [format, setFormat] = useState("JPG");
  const [clean, setClean] = useState(true);
  const [run, setRun] = useState<Run>("idle");
  const data = examples[category];
  const done = run === "done";

  const fileNames = tEx.raw(`files.${category}`) as string[];

  useEffect(() => {
    if (run !== "running") return;
    const timer = setTimeout(
      () => setRun("done"),
      FILL_MS + STAGGER_MS * (fileNames.length - 1),
    );
    return () => clearTimeout(timer);
  }, [run, fileNames.length]);

  return (
    <div
      className="bg-surface text-ui rounded-t-[10px] text-left shadow-[0_-12px_60px_#0006]" /* taste-skill-ignore: desktop window elevation */
      data-ui
    >
      <div
        className="border-line text-muted text-ui relative flex h-10 items-center justify-center border-b" /* taste-skill-ignore: embedded window title bar */
      >
        <div className="absolute left-4 flex gap-1.5" aria-hidden="true">
          <i className="block size-2 rounded-full bg-[#ac7964]" />
          <i className="block size-2 rounded-full bg-[#b8a574]" />
          <i className="block size-2 rounded-full bg-[#8a9b6d]" />
        </div>
        <span className="text-ink">{t("windowTitle")}</span>
        <span className="absolute right-4">{t("windowLabel")}</span>
      </div>
      <div className="md:grid md:min-h-[430px] md:grid-cols-[180px_1fr] lg:grid-cols-[210px_1fr]">
        <aside
          className="border-line flex flex-col border-b p-2 md:border-r md:border-b-0 md:p-3 md:pt-5" /* taste-skill-ignore: embedded application sidebar */
        >
          <div className="hidden items-center gap-2.5 px-3 pb-7 md:flex">
            <BrandIcon size={19} />
            {t("sidebarSpace")}
          </div>
          <span className="text-muted text-ui hidden px-3 pb-2 md:block">
            {t("sidebarLibrary")}
          </span>
          <div
            className="flex justify-between gap-0.5 md:grid md:gap-1"
            role="group"
            aria-label={t("fileTypeLabel")}
          >
            {categories.map((item) => {
              const ItemIcon = examples[item].icon;
              const pressed = category === item;
              const label = tEx(`categories.${item}`);
              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={pressed}
                  className={`text-ui relative flex min-h-11 items-center gap-2.5 rounded-[6px] px-2 text-left transition-colors duration-150 min-[400px]:px-2.5 md:px-3 ${
                    pressed ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                  onClick={() => {
                    setCategory(item);
                    setFormat(examples[item].formats[0]);
                    setRun("idle");
                  }}
                >
                  {pressed && (
                    <motion.span
                      layoutId="demo-category"
                      className="bg-chip absolute inset-0 rounded-[6px]"
                      transition={{ type: "spring", duration: 0.45, bounce: 0 }}
                    />
                  )}
                  <ItemIcon
                    {...icon}
                    size={17}
                    className="relative z-10 hidden md:block"
                  />
                  <span className="relative z-10">{label}</span>
                </button>
              );
            })}
          </div>
          <div className="text-muted text-ui mt-auto hidden items-center gap-2.5 px-3 pt-6 pb-1 leading-[1.4] md:flex">
            <Lock {...icon} size={15} />
            <span>
              {t("device")}
              <br />
              {t("files")}
            </span>
          </div>
        </aside>
        <div className="flex min-w-0 flex-col p-4 md:p-6 lg:p-7">
          <div className="mb-4 flex items-start justify-between gap-3 md:mb-6">
            <div>
              <h3 className="text-[1.375rem] leading-[1.1] tracking-[-0.025em] md:text-[1.5rem]">
                {done ? t("headingDone") : t("headingIdle")}
              </h3>
              <p className="text-muted mt-1.5">
                {done ? t("subtitleDone") : t("subtitleIdle")}
              </p>
            </div>
            <span className="text-muted hidden pt-1.5 whitespace-nowrap md:block">
              {t("fileCount")}
            </span>
          </div>
          <div className="grid gap-1.5" aria-live="polite" key={category}>
            {fileNames.map((file, index) => (
              <div
                className="bg-raised row-in relative flex items-center gap-3 overflow-clip rounded-[6px] p-2 md:px-3 md:py-2.5"
                key={file}
                style={{ "--i": index } as React.CSSProperties}
              >
                <i
                  className={`bg-accent/12 absolute inset-0 block origin-left transition-transform ease-(--ease-in-out) motion-reduce:transition-none ${
                    run === "idle"
                      ? "scale-x-0 duration-200"
                      : "scale-x-100 duration-700"
                  }`}
                  style={{
                    transitionDelay:
                      run === "idle" ? "0ms" : `${index * STAGGER_MS}ms`,
                  }}
                />
                <div className="relative">
                  <Thumbnail
                    category={category}
                    index={index}
                    done={done}
                    icon={data.icon}
                  />
                </div>
                <div className="relative grid min-w-0 flex-1 gap-0.5">
                  <strong className="truncate font-normal">
                    {file}.
                    {done ? format.toLowerCase() : data.extension.toLowerCase()}
                  </strong>
                  <span className="text-muted text-ui leading-[1.3]">
                    {done
                      ? clean
                        ? t("metaNoMetadata")
                        : t("metaWithMetadata")
                      : data.sizes[index]}
                  </span>
                </div>
                <span className="text-ui relative flex items-center gap-2 tabular-nums">
                  <span className="text-muted hidden min-[400px]:inline">
                    {data.extension}
                  </span>
                  <ArrowRight
                    {...icon}
                    size={14}
                    className="text-muted hidden min-[400px]:block"
                  />
                  <span className="text-accent min-w-[2.2em]">{format}</span>
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 md:mt-auto md:pt-6">
            <Select
              label={t("convertLabel")}
              value={format}
              options={data.formats}
              side="top"
              onChange={(value) => {
                setFormat(value);
                setRun("idle");
              }}
            />
            <div className="text-muted flex min-h-10 items-center gap-2.5">
              <ShieldCheck {...icon} size={17} />
              <span>{t("removeMetadata")}</span>
              <Switch
                label={t("removeMetadata")}
                checked={clean}
                onChange={(checked) => {
                  setClean(checked);
                  setRun("idle");
                }}
              />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 pb-1 md:mt-5">
            <span className="text-muted text-ui flex items-center gap-2 leading-[1.3]">
              <span className="bg-accent inline-block size-[5px] shrink-0 rounded-full" />
              {done
                ? clean
                  ? t("statusNoMetadata")
                  : t("statusWithMetadata")
                : t("statusCloud")}
            </span>
            <button
              type="button"
              disabled={run === "running"}
              className="group button-primary !text-ui !min-h-10 disabled:cursor-progress disabled:opacity-70"
              onClick={() => setRun(run === "idle" ? "running" : "idle")}
            >
              {run === "running"
                ? t("runRunning")
                : done
                  ? t("runDone")
                  : t("runIdle")}
              <ArrowRight {...icon} size={16} className="arrow" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
