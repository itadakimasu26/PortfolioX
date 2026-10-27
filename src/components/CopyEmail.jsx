import { useEffect, useRef, useState } from "react";
import { FiCheck, FiCopy, FiMail } from "react-icons/fi";

export default function CopyEmail({ email }) {
  const [state, setState] = useState("idle");
  const resetTimer = useRef(null);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const copyEmail = async () => {
    try {
      if (!navigator.clipboard?.writeText)
        throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      setState("error");
    }

    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setState("idle"), 3500);
  };

  return (
    <div className="contact__email">
      <FiMail
        className="contact__icon contact__icon--email"
        aria-hidden="true"
      />
      <span className="contact__email-address">{email}</span>
      <button
        className="contact__copy"
        type="button"
        aria-label={state === "copied" ? "Email copied" : "Copy email address"}
        onClick={copyEmail}
      >
        {state === "copied" ? (
          <FiCheck aria-hidden="true" />
        ) : (
          <FiCopy aria-hidden="true" />
        )}
        <span>{state === "copied" ? "Copied" : "Copy"}</span>
      </button>
      <span
        className={state === "error" ? "contact__copy-feedback" : "sr-only"}
        role="status"
      >
        {state === "copied"
          ? "Email address copied to clipboard."
          : state === "error"
            ? "Unable to copy. Please select the email address above."
            : ""}
      </span>
    </div>
  );
}
