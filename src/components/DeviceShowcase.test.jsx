import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import DeviceShowcase from "./DeviceShowcase.jsx";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("DeviceShowcase", () => {
  it("raises all three devices once the scene enters view", () => {
    let observer;
    class TestIntersectionObserver {
      constructor(callback) {
        this.callback = callback;
        this.disconnect = vi.fn();
        observer = this;
      }
      observe(element) {
        this.target = element;
      }
    }
    vi.stubGlobal("IntersectionObserver", TestIntersectionObserver);

    const { container } = render(<DeviceShowcase />);
    const scene = screen.getByRole("img", {
      name: "Desktop monitor, laptop, and phone rising upright",
    });
    expect(container.querySelectorAll(".device")).toHaveLength(3);
    expect(scene).not.toHaveClass("is-visible");
    expect(observer.target).toBe(scene);

    act(() => observer.callback([{ isIntersecting: false }]));
    expect(scene).not.toHaveClass("is-visible");
    act(() => observer.callback([{ isIntersecting: true }]));
    expect(scene).toHaveClass("is-visible");
    expect(observer.disconnect).toHaveBeenCalled();
  });

  it("shows the scene immediately when observation is unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    render(<DeviceShowcase />);
    expect(screen.getByRole("img")).toHaveClass("is-visible");
  });
});
