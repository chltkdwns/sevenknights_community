import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, id, className = "", ...props }: InputProps) {
  const inputId = id ?? label;
  return (
    <label htmlFor={inputId} className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-muted">{label}</span>
      <input
        id={inputId}
        className={`rounded-lg border border-border bg-input-bg px-3 py-2.5 text-foreground outline-none transition focus:border-accent ${error ? "border-danger" : ""} ${className}`}
        {...props}
      />
      {error ? <span className="text-xs text-danger">{error}</span> : null}
    </label>
  );
}
