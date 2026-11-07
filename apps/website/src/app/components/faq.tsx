"use client";

import { useId, useState } from "react";
import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Faq() {
  const t = useTranslations("faq");
  const id = useId();
  const categories = t.raw("categories") as Array<{
    name: string;
    questions: [string, string][];
  }>;

  const [category, setCategory] = useState(0);
  const [openByCategory, setOpenByCategory] = useState<(number | null)[]>(() =>
    categories.map(() => 0),
  );

  const open = openByCategory[category];

  const setOpen = (value: number | null) =>
    setOpenByCategory((prev) =>
      prev.map((item, i) => (i === category ? value : item)),
    );

  const select = (index: number) => {
    setCategory(index);
    document.getElementById(`${id}-tab-${index}`)?.focus();
  };

  return (
    <div className="md:col-span-7">
      <div
        role="tablist"
        aria-label={t("categoriesLabel")}
        className="bg-surface flex w-full gap-0.5 rounded-[10px] p-1 sm:w-fit"
        onKeyDown={(event) => {
          const last = categories.length - 1;
          const moves: Record<string, number> = {
            ArrowRight: category === last ? 0 : category + 1,
            ArrowLeft: category === 0 ? last : category - 1,
            Home: 0,
            End: last,
          };
          if (event.key in moves) {
            event.preventDefault();
            select(moves[event.key]);
          }
        }}
      >
        {categories.map(({ name }, index) => (
          <button
            key={name}
            id={`${id}-tab-${index}`}
            type="button"
            role="tab"
            aria-selected={category === index}
            aria-controls={`${id}-panel-${index}`}
            tabIndex={category === index ? 0 : -1}
            onClick={() => setCategory(index)}
            className={`text-ui relative h-9 flex-1 rounded-[7px] px-1.5 transition-colors duration-150 sm:flex-none sm:px-3.5 ${
              category === index ? "text-ink" : "text-muted hover:text-ink"
            }`}
          >
            {category === index && (
              <motion.span
                layoutId="faq-tab"
                className="bg-chip absolute inset-0 rounded-[7px]"
                transition={{ type: "spring", duration: 0.45, bounce: 0 }}
              />
            )}
            <span className="relative z-10">{name}</span>
          </button>
        ))}
      </div>

      {categories.map(({ name, questions }, catIndex) => (
        <div
          key={name}
          id={`${id}-panel-${catIndex}`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${catIndex}`}
          hidden={category !== catIndex}
          data-faq-panel
          className="mt-3 md:min-h-[330px]"
        >
          <div className="grid gap-2">
            {questions.map(([question, answer], questionIndex) => {
              const expanded =
                category === catIndex &&
                openByCategory[catIndex] === questionIndex;
              return (
                <div
                  key={question}
                  className="bg-surface row-in rounded-[10px]"
                  style={{ "--i": questionIndex } as React.CSSProperties}
                >
                  <h3 className="text-body tracking-normal">
                    <button
                      type="button"
                      aria-expanded={expanded}
                      onClick={() =>
                        setOpenByCategory((prev) =>
                          prev.map((item, i) =>
                            i === catIndex
                              ? item === questionIndex
                                ? null
                                : questionIndex
                              : item,
                          ),
                        )
                      }
                      className="hover:text-accent flex min-h-[54px] w-full items-center justify-between gap-5 rounded-[10px] px-4 py-3 text-left font-medium transition-colors duration-150"
                    >
                      {question}
                      <Plus
                        size={18}
                        strokeWidth={1.5}
                        aria-hidden
                        className={`shrink-0 transition-transform duration-300 ease-(--ease-out) ${
                          expanded ? "rotate-45" : ""
                        }`}
                      />
                    </button>
                  </h3>
                  <div
                    data-answer
                    className={`grid transition-[grid-template-rows,visibility] duration-300 ease-(--ease-out) motion-reduce:transition-none ${
                      expanded
                        ? "visible grid-rows-[1fr]"
                        : "invisible grid-rows-[0fr]"
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <p className="text-muted max-w-[60ch] px-4 pb-4">
                        {answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
