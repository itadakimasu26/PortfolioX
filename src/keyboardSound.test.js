import { afterEach, describe, expect, it, vi } from "vitest";
import { createKeyboardSound } from "./keyboardSound.js";

afterEach(() => vi.unstubAllGlobals());

describe("keyboard sound", () => {
  it("starts after audio is unlocked and plays short layered clicks", async () => {
    const sources = [];
    const makeNode = () => ({ connect: vi.fn().mockReturnThis() });
    class MockAudioContext {
      state = "suspended";
      sampleRate = 44100;
      currentTime = 1;
      destination = {};
      resume = vi.fn(async () => {
        this.state = "running";
      });
      close = vi.fn(async () => {
        this.state = "closed";
      });
      createBuffer = vi.fn((channels, length) => ({
        getChannelData: () => new Float32Array(length),
      }));
      createBufferSource = vi.fn(() => {
        const source = {
          ...makeNode(),
          playbackRate: { value: 1 },
          start: vi.fn(),
          stop: vi.fn(),
        };
        sources.push(source);
        return source;
      });
      createBiquadFilter = vi.fn(() => ({
        ...makeNode(),
        frequency: { value: 0 },
        Q: { value: 0 },
      }));
      createGain = vi.fn(() => ({
        ...makeNode(),
        gain: {
          setValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn(),
        },
      }));
      createOscillator = vi.fn(() => ({
        ...makeNode(),
        frequency: {
          setValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn(),
        },
        start: vi.fn(),
        stop: vi.fn(),
      }));
    }
    vi.stubGlobal("AudioContext", MockAudioContext);

    const sound = createKeyboardSound();
    sound.play();
    expect(sources).toHaveLength(0);
    await sound.unlock();
    expect(sound.isReady()).toBe(true);
    sound.play();
    sound.play(true);
    expect(sources).toHaveLength(2);
    expect(sources[0].start).toHaveBeenCalledWith(1);
    expect(sources[0].stop).toHaveBeenCalledWith(1.035);
    sound.dispose();
    expect(sound.isReady()).toBe(false);
    sound.play();
    expect(sources).toHaveLength(2);
  });

  it("degrades silently when Web Audio is unavailable", async () => {
    vi.stubGlobal("AudioContext", undefined);
    vi.stubGlobal("webkitAudioContext", undefined);
    const sound = createKeyboardSound();
    await expect(sound.unlock()).resolves.toBeUndefined();
    expect(() => sound.play()).not.toThrow();
    sound.dispose();
  });
});
