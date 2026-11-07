"use client";

export default function Switch({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-[22px] w-[38px] shrink-0 rounded-full transition-colors duration-200 ${
        checked ? "bg-accent" : "bg-chip"
      }`}
    >
      <i
        className={`absolute top-[3px] left-[3px] block size-4 rounded-full transition-[transform,background-color] duration-200 ease-(--ease-out) ${
          checked ? "bg-bg translate-x-4" : "bg-ink"
        }`}
      />
    </button>
  );
}
