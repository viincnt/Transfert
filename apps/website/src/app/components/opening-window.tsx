"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "motion/react";

/**
 * The landscape opens from an inset to the page's frame while the desktop
 * window climbs into place. Offsets stay on whole pixels so its text stays sharp.
 */
export default function OpeningWindow({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 92%", "start 22%"],
  });
  const inset = useTransform(scrollYProgress, [0, 1], [4, 0]);
  const clipPath = useMotionTemplate`inset(0 ${inset}% 0 ${inset}% round 14px)`;
  const windowY = useTransform(scrollYProgress, (value) =>
    Math.round((1 - value) * 64),
  );
  const photoY = useTransform(scrollYProgress, [0, 1], ["-4%", "0%"]);

  return (
    <div
      ref={ref}
      className="frame hero-rise"
      style={{ "--d": "520ms" } as React.CSSProperties}
    >
      <motion.div
        data-scrub
        style={{ clipPath }}
        className="relative overflow-clip rounded-[14px] bg-[#3f5c78]"
      >
        <motion.div
          data-scrub
          style={{ y: photoY }}
          className="absolute inset-x-0 -inset-y-[5%]"
        >
          <Image
            src="/mountains.jpg"
            alt=""
            fill
            priority
            sizes="(min-width: 1144px) 1080px, 100vw"
            className="hero-settle object-cover object-[center_48%]"
          />
        </motion.div>
        <div className="relative mx-auto w-[calc(100%-24px)] pt-6 md:w-[calc(100%-96px)] md:pt-14">
          <motion.div
            data-scrub
            className="relative z-10"
            style={{ y: windowY }}
          >
            {children}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
