"use client";

import {
  InputHTMLAttributes,
  useCallback,
  useId,
  useState,
} from "react";
import {
  getPasswordStrength,
  PASSWORD_STRENGTH_LABEL,
  type PasswordStrength,
} from "@/lib/password";

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M1 1l22 22" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    </svg>
  );
}

const strengthBarClass: Record<
  Exclude<PasswordStrength, null>,
  string
> = {
  weak: "bg-strength-weak w-1/3",
  medium: "bg-strength-medium w-2/3",
  strong: "bg-strength-strong w-full",
};

const strengthTextClass: Record<
  Exclude<PasswordStrength, null>,
  string
> = {
  weak: "text-strength-weak",
  medium: "text-strength-medium",
  strong: "text-strength-strong",
};

interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
  hint?: string;
  hintStatus?: "idle" | "valid" | "invalid";
  showStrength?: boolean;
  onCapsLockChange?: (enabled: boolean) => void;
}

export function PasswordInput({
  label,
  error,
  hint,
  hintStatus = "idle",
  showStrength = false,
  onCapsLockChange,
  id: externalId,
  className = "",
  value = "",
  onKeyDown,
  onKeyUp,
  onBlur,
  ...props
}: PasswordInputProps) {
  const generatedId = useId();
  const inputId = externalId ?? generatedId;
  const [visible, setVisible] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);

  const passwordValue = String(value);
  const strength = showStrength ? getPasswordStrength(passwordValue) : null;

  const detectCapsLock = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const on = e.getModifierState("CapsLock");
      setCapsLockOn(on);
      onCapsLockChange?.(on);
    },
    [onCapsLockChange]
  );

  const hintClass =
    hintStatus === "valid"
      ? "text-success"
      : hintStatus === "invalid"
        ? "text-danger"
        : "text-muted";

  return (
    <div className="flex flex-col gap-1.5 text-sm">
      <label htmlFor={inputId} className="font-medium text-muted">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          value={value}
          className={`w-full rounded-lg border border-border bg-input-bg py-2.5 pl-3 pr-11 text-foreground outline-none transition focus:border-accent ${error ? "border-danger" : ""} ${className}`}
          onKeyDown={(e) => {
            detectCapsLock(e);
            onKeyDown?.(e);
          }}
          onKeyUp={(e) => {
            detectCapsLock(e);
            onKeyUp?.(e);
          }}
          onBlur={(e) => {
            setCapsLockOn(false);
            onCapsLockChange?.(false);
            onBlur?.(e);
          }}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted transition hover:bg-surface-hover hover:text-foreground"
          aria-label={visible ? "비밀번호 숨기기" : "비밀번호 표시"}
        >
          <EyeIcon open={visible} />
        </button>
      </div>

      {capsLockOn ? (
        <p className="text-xs text-warning" role="status">
          Caps Lock이 켜져 있습니다.
        </p>
      ) : null}

      {showStrength && strength ? (
        <div className="flex flex-col gap-1">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div
              className={`h-full rounded-full transition-all duration-300 ${strengthBarClass[strength]}`}
            />
          </div>
          <p className={`text-xs font-medium ${strengthTextClass[strength]}`}>
            비밀번호 강도: {PASSWORD_STRENGTH_LABEL[strength]}
          </p>
        </div>
      ) : null}

      {hint && !error ? (
        <p className={`text-xs ${hintClass}`} role="status">
          {hint}
        </p>
      ) : null}

      {error ? (
        <span className="text-xs text-danger" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}
