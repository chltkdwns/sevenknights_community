type HintStatus = "idle" | "valid" | "invalid";

interface ValidationHintProps {
  message: string;
  status?: HintStatus;
}

const statusClass: Record<HintStatus, string> = {
  idle: "text-muted",
  valid: "text-success",
  invalid: "text-danger",
};

export function ValidationHint({
  message,
  status = "idle",
}: ValidationHintProps) {
  if (!message) return null;
  return (
    <p className={`text-xs ${statusClass[status]}`} role="status">
      {message}
    </p>
  );
}
