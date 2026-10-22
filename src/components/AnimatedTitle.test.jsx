import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AnimatedTitle from "./AnimatedTitle.jsx";

const sound = vi.hoisted(() => ({
  unlock: vi.fn(() => Promise.resolve()),
  play: vi.fn(),
  isReady: vi.fn(() => true),
  dispose: vi.fn(),
}));
vi.mock("../keyboardSound.js", () => ({ createKeyboardSound: () => sound }));

beforeEach(() => {
  vi.clearAllMocks();
  window.matchMedia = (query) => ({
    matches: true,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  });
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("AnimatedTitle", () => {
  it("types, pauses, erases, and changes role color without overlapping titles", () => {
    vi.useFakeTimers();
    const { container } = render(<AnimatedTitle />);
    const text = container.querySelector(".animated-title__text");
    const title = container.querySelector(".animated-title");

    expect(
      screen.getByText("Software Developer and Technical Support"),
    ).toBeInTheDocument();
    expect(title).toHaveClass("role-developer");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    for (let i = 0; i < "Software Developer".length; i += 1) {
      act(() => vi.advanceTimersByTime(86));
    }
    expect(text).toHaveTextContent("Software Developer");
    expect(sound.play).toHaveBeenCalledTimes("Software Developer".length);
    expect(sound.play).toHaveBeenLastCalledWith(false);
    act(() => vi.advanceTimersByTime(1999));
    expect(text).toHaveTextContent("Software Developer");
    act(() => vi.advanceTimersByTime(1));
    for (let i = 0; i < "Software Developer".length; i += 1) {
      act(() => vi.advanceTimersByTime(50));
    }
    expect(sound.play).toHaveBeenLastCalledWith(true);
    expect(text).not.toHaveTextContent("Software Developer");
    act(() => vi.advanceTimersByTime(340));
    expect(title).toHaveClass("role-support");
    act(() => vi.advanceTimersByTime(86));
    expect(text).toHaveTextContent("T");
    expect(text).not.toHaveTextContent("Software");
    for (let i = 1; i < "Technical Support".length; i += 1) {
      act(() => vi.advanceTimersByTime(86));
    }
    expect(text).toHaveTextContent("Technical Support");
    expect(title).toHaveClass("role-support");
  });

  it("continues cycling without a control when reduced motion is preferred", () => {
    vi.useFakeTimers();
    const { container } = render(<AnimatedTitle />);
    const title = container.querySelector(".animated-title");
    const text = container.querySelector(".animated-title__text");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    for (let i = 0; i < "Software Developer".length; i += 1) {
      act(() => vi.advanceTimersByTime(86));
    }
    act(() => vi.advanceTimersByTime(2000));
    for (let i = 0; i < "Software Developer".length; i += 1) {
      act(() => vi.advanceTimersByTime(50));
    }
    act(() => vi.advanceTimersByTime(340));
    expect(title).toHaveClass("role-support");
    for (let i = 0; i < "Technical Support".length; i += 1) {
      act(() => vi.advanceTimersByTime(86));
    }
    expect(text).toHaveTextContent("Technical Support");
    act(() => vi.advanceTimersByTime(2000));
    for (let i = 0; i < "Technical Support".length; i += 1) {
      act(() => vi.advanceTimersByTime(50));
    }
    act(() => vi.advanceTimersByTime(340));
    expect(title).toHaveClass("role-developer");
    act(() => vi.advanceTimersByTime(86));
    expect(text).toHaveTextContent("S");
  });
});
