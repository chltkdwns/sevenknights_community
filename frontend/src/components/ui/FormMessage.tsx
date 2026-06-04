"use client";

interface FormMessageProps {
  messages?: string | string[] | null;
  color?: "danger" | "success" | "muted";
}

const colorClass = {
  danger: "text-danger",
  success: "text-success",
  muted: "text-muted",
};

export function FormMessage({ messages, color = "danger" }: FormMessageProps) {
  if (!messages) return null;
  const rows = Array.isArray(messages) ? messages : [messages];
  if (rows.length === 0) return null;

  return (
    <div className="mt-1 flex flex-col gap-1 pl-1">
      {rows.map((message, index) => (
        <p key={`${message}-${index}`} className={`text-xs ${colorClass[color]}`}>
          {message}
        </p>
      ))}
    </div>
  );
}
