import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { FileConverter } from "./file-converter";
import "@/i18n";
import userEvent from "@testing-library/user-event";

const { invoke } = vi.hoisted(() => ({ invoke: vi.fn() }));
vi.mock("@tauri-apps/api/core", () => ({ invoke }));
vi.mock("@tauri-apps/plugin-dialog", () => ({ open: vi.fn() }));

beforeEach(() => invoke.mockReset());

it("keeps documents usable without a native media runtime", () => {
  render(<FileConverter kind="document" />);
  expect(screen.getByText("Document Converter")).toBeTruthy();
  expect(screen.getByRole("button", { name: /browse/i })).toBeTruthy();
  expect(invoke).not.toHaveBeenCalled();
});

it("blocks media input when LibVLC is unavailable and supports retry", async () => {
  invoke
    .mockRejectedValueOnce("LibVLC runtime unavailable")
    .mockResolvedValueOnce(undefined);
  render(<FileConverter kind="audio" />);
  expect(await screen.findByText("LibVLC runtime unavailable")).toBeTruthy();
  expect(screen.queryByRole("button", { name: /browse/i })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Check again" }));
  expect(await screen.findByRole("button", { name: /browse/i })).toBeTruthy();
  await waitFor(() => expect(invoke).toHaveBeenCalledTimes(2));
  expect(invoke).toHaveBeenCalledWith("media_runtime_command");
});

it("only accepts audio formats available as outputs, while keeping aliases", async () => {
  invoke.mockResolvedValue(undefined);
  const user = userEvent.setup({ applyAccept: false });
  const { container } = render(<FileConverter kind="audio" />);
  await screen.findByRole("button", { name: /browse/i });
  const input =
    container.querySelector<HTMLInputElement>('input[type="file"]')!;
  expect(input.accept.split(",")).toEqual([
    ".mp3",
    ".wav",
    ".wave",
    ".flac",
    ".ogg",
    ".opus",
    ".m4a",
  ]);
  expect(screen.queryByText("APE")).toBeNull();
  expect(screen.queryByText("WAVE")).toBeNull();
  await user.upload(input, new File(["fixture"], "unsupported.ape"));
  expect(
    await screen.findByText(/unsupported.ape.*supported format/i),
  ).toBeTruthy();
  await user.upload(input, new File(["fixture"], "supported.WAVE"));
  expect(await screen.findByText("supported.WAVE")).toBeTruthy();
});
