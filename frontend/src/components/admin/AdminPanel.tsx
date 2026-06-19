type AdminPanelProps = {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
};

export function AdminPanel({ title, action, children }: AdminPanelProps) {
  return (
    <section className="rounded-xl border border-border bg-surface p-6">
      {title || action ? (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {title ? <h1 className="text-xl font-bold">{title}</h1> : <div />}
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}
