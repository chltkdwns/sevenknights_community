import { ReactNode } from "react";

interface AuthFormCardProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthFormCard({
  title,
  description,
  children,
  footer,
}: AuthFormCardProps) {
  return (
    <section className="mx-auto w-full max-w-md">
      <h1 className="mb-2 text-2xl font-bold text-foreground">{title}</h1>
      <p className="mb-6 text-sm text-muted sm:mb-8">{description}</p>
      <div className="rounded-xl border border-border bg-surface p-5 shadow-sm sm:p-6">
        {children}
      </div>
      {footer ? <div className="mt-4">{footer}</div> : null}
    </section>
  );
}
