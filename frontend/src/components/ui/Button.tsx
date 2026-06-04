import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

const variantClass: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-foreground hover:bg-accent-hover disabled:opacity-50",
  secondary:
    "bg-surface border border-border text-foreground hover:bg-surface-hover disabled:opacity-50",
  danger:
    "bg-danger/20 text-danger border border-danger/40 hover:bg-danger/30 disabled:opacity-50",
  ghost: "text-muted hover:text-foreground disabled:opacity-50",
};

export function Button({
  variant = "primary",
  fullWidth,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition ${variantClass[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
