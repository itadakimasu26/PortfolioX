export function createKeyboardSound() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  let context;
  let noise;
  let disposed = false;

  function getContext() {
    if (disposed || !AudioContextClass) return null;
    if (!context) {
      try {
        context = new AudioContextClass();
        const length = Math.ceil(context.sampleRate * 0.06);
        noise = context.createBuffer(1, length, context.sampleRate);
        const samples = noise.getChannelData(0);
        for (let i = 0; i < length; i += 1) {
          samples[i] = Math.random() * 2 - 1;
        }
      } catch {
        return null;
      }
    }
    return context;
  }

  async function unlock() {
    const audio = getContext();
    if (audio?.state === "suspended") {
      try {
        await audio.resume();
      } catch {
        // The next user gesture can retry if the browser blocked this attempt.
      }
    }
  }

  function play(erasing = false) {
    if (document.hidden) return;
    const audio = getContext();
    if (audio?.state !== "running" || !noise) return;

    const now = audio.currentTime;
    const variation = Math.random();
    const click = audio.createBufferSource();
    const filter = audio.createBiquadFilter();
    const clickGain = audio.createGain();
    click.buffer = noise;
    click.playbackRate.value = 0.85 + variation * 0.3;
    filter.type = "bandpass";
    filter.frequency.value = 1600 + variation * 900;
    filter.Q.value = 0.8;
    clickGain.gain.setValueAtTime(0.0001, now);
    clickGain.gain.exponentialRampToValueAtTime(
      erasing ? 0.048 : 0.06,
      now + 0.002,
    );
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.032);
    click.connect(filter).connect(clickGain).connect(audio.destination);
    click.start(now);
    click.stop(now + 0.035);

    const thock = audio.createOscillator();
    const thockGain = audio.createGain();
    thock.type = "triangle";
    thock.frequency.setValueAtTime(155 + variation * 35, now);
    thock.frequency.exponentialRampToValueAtTime(85, now + 0.04);
    thockGain.gain.setValueAtTime(0.018, now);
    thockGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
    thock.connect(thockGain).connect(audio.destination);
    thock.start(now);
    thock.stop(now + 0.045);
  }

  function dispose() {
    disposed = true;
    if (context && context.state !== "closed") void context.close();
  }

  return {
    unlock,
    play,
    isReady: () => !disposed && context?.state === "running",
    dispose,
  };
}
