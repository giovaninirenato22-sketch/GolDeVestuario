import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Migas de pan" className="text-caption mb-6 flex flex-wrap items-center gap-2 text-fg-muted">
      {items.map((item, index) => (
        <span key={item.label} className="flex items-center gap-2">
          {item.href ? (
            <Link href={item.href} className="hover:text-fg-secondary">
              {item.label}
            </Link>
          ) : (
            <span className="text-fg-secondary">{item.label}</span>
          )}
          {index < items.length - 1 ? <span aria-hidden="true">›</span> : null}
        </span>
      ))}
    </nav>
  );
}
