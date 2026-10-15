import type { KeyboardEvent } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormatSelectProps = {
  formats: string[];
  value: string;
  onValueChange: (value: string) => void;
  disabledFormats?: string[];
  disabled?: boolean;
  label: string;
  placeholder?: string;
};

// Keep keyboard movement aligned with the three visual columns, including
// disabled source formats. Radix handles selection, typeahead and Escape.
function navigateGrid(event: KeyboardEvent<HTMLDivElement>) {
  const steps: Record<string, number> = {
    ArrowLeft: -1,
    ArrowRight: 1,
    ArrowUp: -3,
    ArrowDown: 3,
  };
  const step = steps[event.key];
  if (!step) return;
  const options = Array.from(
    event.currentTarget.querySelectorAll<HTMLElement>('[role="option"]'),
  );
  const current = options.findIndex(
    (option) => option === document.activeElement,
  );
  if (current < 0) return;
  event.preventDefault();
  for (
    let next = current + step;
    next >= 0 && next < options.length;
    next += step
  ) {
    if (options[next].getAttribute("aria-disabled") !== "true") {
      options[next].focus();
      return;
    }
  }
}

export function FormatSelect({
  formats,
  value,
  onValueChange,
  disabledFormats = [],
  disabled = false,
  label,
  placeholder,
}: FormatSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger aria-label={label} className="w-28 shrink-0">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        aria-label={label}
        align="end"
        className="max-h-[min(20rem,var(--radix-select-content-available-height))] w-72 max-w-[calc(100vw-2rem)]"
        onKeyDown={navigateGrid}
      >
        <SelectGroup className="grid grid-cols-3 gap-1.5 p-2">
          {formats.map((format) => (
            <SelectItem
              key={format}
              value={format}
              disabled={disabledFormats.includes(format)}
              className="h-10 min-w-0 justify-center border border-border/70 bg-card pr-6 pl-2 font-mono text-xs font-medium data-[state=checked]:border-primary/50 data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
            >
              {format}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
