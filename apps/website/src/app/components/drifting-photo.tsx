"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";

/** A photo held slightly oversize in its frame, drifting with the scroll. */
export default function DriftingPhoto({
  alt = "",
  sizes,
  className,
}: {
  alt?: string;
  sizes: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);
  return (
    <div ref={ref} className="absolute inset-0 overflow-clip">
      <motion.div
        data-scrub
        style={{ y }}
        className="absolute inset-x-0 -inset-y-[5%]"
      >
        <Image
          src="/mountains.jpg"
          alt={alt}
          fill
          sizes={sizes}
          className={`object-cover ${className ?? ""}`}
        />
      </motion.div>
    </div>
  );
}
