import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ConversionQueue, type QueueItem } from "./conversion-queue";
import "@/i18n";

const { open } = vi.hoisted(() => ({ open: vi.fn() }));
vi.mock("@tauri-apps/plugin-dialog", () => ({ open }));

const item = (name: string): QueueItem => ({
  id: name,
  file: new File(["fixture"], name),
});
const result = {
  fileName: "result.webp",
  path: "/output/result.webp",
  size: 10,
  sha256: "hash",
};

function props(items = [item("photo.PNG")]) {
  return {
    items,
    formats: ["PNG", "JPG", "WEBP"],
    onAddFiles: vi.fn(),
    onRemoveItem: vi.fn(),
    onClear: vi.fn(),
    onConvertItem: vi.fn().mockResolvedValue(result),
    onConvertBatchToZip: vi
      .fn()
      .mockResolvedValue({
        zip: result,
        entries: items.map((item) => ({
          id: item.id,
          fileName: "result.webp",
        })),
      }),
  };
}

beforeEach(() => {
  open.mockReset();
  open.mockResolvedValue("/output");
});

describe("conversion queue", () => {
  it("disables source formats in the actual dropdown and selects a valid default", async () => {
    const user = userEvent.setup();
    render(<ConversionQueue {...props()} />);
    const select = screen.getAllByRole("combobox")[0];
    expect(select.textContent).toContain("JPG");
    await user.click(select);
    expect(
      screen.getByRole("option", { name: "PNG" }).getAttribute("aria-disabled"),
    ).toBe("true");
    expect(
      screen
        .getByRole("option", { name: "WEBP" })
        .getAttribute("aria-disabled"),
    ).not.toBe("true");
  });

  it("reconciles defaults when mixed-format files are added and sends valid targets", async () => {
    const user = userEvent.setup();
    const options = props();
    const view = render(<ConversionQueue {...options} />);
    const items = [item("photo.PNG"), item("photo.JPEG")];
    view.rerender(<ConversionQueue {...options} items={items} />);
    await user.click(screen.getByRole("button", { name: /Convert 2 files/i }));
    await waitFor(() => expect(options.onConvertItem).toHaveBeenCalledTimes(2));
    expect(options.onConvertItem.mock.calls.map((call) => call[1])).toEqual([
      "WEBP",
      "WEBP",
    ]);
  });

  it("allows per-file targets when no common format is available", async () => {
    const user = userEvent.setup();
    const options = props([item("a.png"), item("b.jpeg"), item("c.webp")]);
    render(<ConversionQueue {...options} />);
    expect(screen.getByText("Choose per file")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: /Convert 3 files/i }));
    await waitFor(() => expect(options.onConvertItem).toHaveBeenCalledTimes(3));
    expect(options.onConvertItem.mock.calls.map((call) => call[1])).toEqual([
      "JPG",
      "PNG",
      "PNG",
    ]);
  });

  it("keeps same-format encoding available for the optimizer", async () => {
    const user = userEvent.setup();
    render(<ConversionQueue {...props()} allowSameFormat />);
    await user.click(screen.getAllByRole("combobox")[0]);
    expect(
      screen.getByRole("option", { name: "PNG" }).getAttribute("aria-disabled"),
    ).not.toBe("true");
  });

  it("does not convert when the destination dialog is cancelled", async () => {
    const user = userEvent.setup();
    open.mockResolvedValue(null);
    const options = props();
    render(<ConversionQueue {...options} />);
    await user.click(screen.getByRole("button", { name: /Convert 1 file/i }));
    expect(open).toHaveBeenCalled();
    expect(options.onConvertItem).not.toHaveBeenCalled();
  });

  it("passes valid targets to ZIP and reports missing results as errors", async () => {
    const options = props();
    options.onConvertBatchToZip.mockResolvedValue({ zip: result, entries: [] });
    render(<ConversionQueue {...options} />);
    fireEvent.click(screen.getByRole("radio", { name: /zip/i }));
    fireEvent.click(screen.getByRole("button", { name: /Convert 1 file/i }));
    await waitFor(() => expect(options.onConvertBatchToZip).toHaveBeenCalled());
    expect(options.onConvertBatchToZip.mock.calls[0][0][0].format).toBe("JPG");
    expect(
      await screen.findByText("No converted file was returned"),
    ).toBeTruthy();
  });

  it("shows backend errors and lets the user retry", async () => {
    const options = props();
    options.onConvertItem.mockRejectedValueOnce(new Error("Codec unavailable"));
    render(<ConversionQueue {...options} />);
    fireEvent.click(screen.getByRole("button", { name: /Convert 1 file/i }));
    expect(await screen.findByText("Codec unavailable")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Convert 1 file/i }));
    await waitFor(() => expect(options.onConvertItem).toHaveBeenCalledTimes(2));
    await waitFor(() =>
      expect(screen.queryByText("Codec unavailable")).toBeNull(),
    );
  });
});
