import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-border py-16 text-center">
      <p className="text-h2 text-fg">{title}</p>
      {description ? <p className="text-body max-w-md text-fg-secondary">{description}</p> : null}
      {action}
    </div>
  );
}
