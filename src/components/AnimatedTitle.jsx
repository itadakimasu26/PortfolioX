import { useCallback, useEffect, useRef, useState } from "react";
import { createKeyboardSound } from "../keyboardSound.js";

const roles = [
  { text: "Software Developer", className: "role-developer" },
  { text: "Technical Support", className: "role-support" },
];
const initialAnimation = { roleIndex: 0, count: 0, phase: "typing" };
export default function AnimatedTitle() {
  const [animation, setAnimation] = useState(initialAnimation);
  const soundRef = useRef(null);
  const { roleIndex, count, phase } = animation;
  const role = roles[roleIndex];

  useEffect(() => {
    const sound = createKeyboardSound();
    soundRef.current = sound;

    const unlockSound = () => {
      void sound.unlock().then(() => {
        if (sound.isReady()) {
          window.removeEventListener("pointerdown", unlockSound);
          window.removeEventListener("keydown", unlockSound);
        }
      });
    };

    unlockSound();
    window.addEventListener("pointerdown", unlockSound);
    window.addEventListener("keydown", unlockSound);

    return () => {
      window.removeEventListener("pointerdown", unlockSound);
      window.removeEventListener("keydown", unlockSound);
      soundRef.current = null;
      sound.dispose();
    };
  }, []);

  const playKey = useCallback((erasing) => {
    soundRef.current?.play(erasing);
  }, []);

  useEffect(() => {
    let delay;
    let next;
    if (phase === "typing" && count < role.text.length) {
      delay = 86;
      next = { roleIndex, count: count + 1, phase: "typing" };
    } else if (phase === "typing") {
      delay = 2000;
      next = { roleIndex, count, phase: "erasing" };
    } else if (count > 0) {
      delay = 50;
      next = { roleIndex, count: count - 1, phase: "erasing" };
    } else {
      delay = 340;
      next = {
        roleIndex: (roleIndex + 1) % roles.length,
        count: 0,
        phase: "typing",
      };
    }

    const timeout = window.setTimeout(() => {
      if (next.count !== count) playKey(phase === "erasing");
      setAnimation(next);
    }, delay);
    return () => window.clearTimeout(timeout);
  }, [count, phase, playKey, role.text, roleIndex]);

  return (
    <span className="animated-title__row">
      <span className="sr-only">Software Developer and Technical Support</span>
      <span className={`animated-title ${role.className}`}>
        <span className="animated-title__text" aria-hidden="true">
          {role.text.slice(0, count)}
          <span className="animated-title__cursor" />
        </span>
      </span>
    </span>
  );
}
