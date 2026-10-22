import { useEffect, useRef, useState } from "react";

export default function DeviceShowcase() {
  const sceneRef = useRef(null);
  const [visible, setVisible] = useState(
    () => typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    if (visible || !sceneRef.current) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -25% 0px" },
    );
    observer.observe(sceneRef.current);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <div
      ref={sceneRef}
      className={`device-scene${visible ? " is-visible" : ""}`}
      role="img"
      aria-label="Desktop monitor, laptop, and phone rising upright"
    >
      <div className="device device--desktop" aria-hidden="true">
        <div className="desktop__frame">
          <div className="desktop__screen">
            <div className="device__toolbar">
              <i />
              <i />
              <i />
            </div>
            <div className="desktop__page">
              <span className="desktop__label">MJO / DIGITAL WORK</span>
              <strong>Build with purpose.</strong>
              <span className="desktop__accent" />
              <span className="desktop__tiles">
                <i />
                <i />
                <i />
              </span>
            </div>
          </div>
        </div>
        <div className="desktop__stem" />
        <div className="desktop__foot" />
      </div>

      <div className="device device--laptop" aria-hidden="true">
        <div className="laptop__lid">
          <div className="laptop__screen">
            <div className="device__toolbar">
              <i />
              <i />
              <i />
            </div>
            <div className="laptop__page">
              <span className="laptop__sidebar">
                <i />
                <i />
                <i />
              </span>
              <span className="laptop__content">
                <i />
                <i />
                <i />
                <i />
              </span>
            </div>
          </div>
        </div>
        <div className="laptop__base">
          <span className="laptop__trackpad" />
        </div>
      </div>

      <div className="device device--phone" aria-hidden="true">
        <div className="phone__speaker" />
        <div className="phone__screen">
          <span className="phone__eyebrow">HELLO.</span>
          <span className="phone__avatar">MJ</span>
          <span className="phone__line" />
          <span className="phone__line phone__line--short" />
          <span className="phone__button" />
        </div>
        <div className="phone__home" />
      </div>
    </div>
  );
}
