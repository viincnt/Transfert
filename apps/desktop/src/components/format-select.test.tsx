import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FormatSelect } from "./format-select";

const formats = ["PNG", "JPG", "WEBP", "GIF", "BMP", "TIFF", "AVIF", "ICO"];

describe("format grid", () => {
  it("keeps every format in three columns, including an incomplete final row", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <FormatSelect
        label="Output format"
        formats={formats}
        value="JPG"
        disabledFormats={["PNG"]}
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByRole("combobox", { name: "Output format" }));
    expect(screen.getByRole("group").className).toContain("grid-cols-3");
    expect(
      screen.getAllByRole("option").map((option) => option.textContent),
    ).toEqual(formats);
    await user.click(screen.getByRole("option", { name: "PNG" }));
    expect(onValueChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole("option", { name: "ICO" }));
    expect(onValueChange).toHaveBeenCalledWith("ICO");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("navigates by column, skips disabled tiles and selects with the keyboard", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <FormatSelect
        label="Output format"
        formats={formats}
        value="JPG"
        disabledFormats={["BMP"]}
        onValueChange={onValueChange}
      />,
    );
    const trigger = screen.getByRole("combobox");
    trigger.focus();
    await user.keyboard("{Enter}");
    await waitFor(() =>
      expect(document.activeElement).toBe(
        screen.getByRole("option", { name: "JPG" }),
      ),
    );
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(
      screen.getByRole("option", { name: "ICO" }),
    );
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(
      screen.getByRole("option", { name: "ICO" }),
    );
    await user.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(
      screen.getByRole("option", { name: "AVIF" }),
    );
    await user.keyboard("{ArrowUp}");
    expect(document.activeElement).toBe(
      screen.getByRole("option", { name: "GIF" }),
    );
    await user.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("GIF");
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it("closes on Escape without changing the selected format", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <FormatSelect
        label="Output format"
        formats={formats}
        value="JPG"
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByRole("combobox"));
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
