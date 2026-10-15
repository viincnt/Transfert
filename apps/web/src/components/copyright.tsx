"use client";

import { useEffect, useState } from "react";

export function Copyright() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <p className="text-xs text-[var(--muted)]" suppressHydrationWarning>
      © {year ?? new Date().getFullYear()} Vicente. All rights reserved.
    </p>
  );
}
