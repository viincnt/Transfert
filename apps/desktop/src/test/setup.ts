import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(cleanup);

// Browser APIs used by Radix that jsdom does not implement.
HTMLElement.prototype.hasPointerCapture = () => false;
HTMLElement.prototype.setPointerCapture = () => {};
HTMLElement.prototype.releasePointerCapture = () => {};
HTMLElement.prototype.scrollIntoView = () => {};
