import type { ReactNode } from "react";

export function Section({
  children,
  className,
  border = true,
}: {
  children: ReactNode;
  className?: string;
  border?: boolean;
}) {
  return (
    <section className={`py-10 sm:py-14 ${border ? "border-b border-border" : ""} ${className ?? ""}`}>
      {children}
    </section>
  );
}
