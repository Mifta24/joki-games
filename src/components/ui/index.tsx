import type { ReactNode } from "react";

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  external,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "wa" | "ghost";
  className?: string;
  external?: boolean;
}) {
  const styles = {
    primary: "bg-brand hover:bg-brand-dark text-white",
    wa: "bg-wa hover:brightness-110 text-black",
    ghost: "border border-line hover:bg-surface text-white",
  }[variant];
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold transition ${styles} ${className}`}
    >
      {children}
    </a>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-surface p-5 ${className}`}>{children}</div>;
}

export function Badge({ children }: { children: ReactNode }) {
  return <span className="rounded-full bg-brand/15 px-3 py-1 text-xs font-medium text-brand">{children}</span>;
}

export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line rounded-2xl border border-line bg-surface">
      {items.map((it) => (
        <details key={it.q} className="group p-5">
          <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
            {it.q}
            <span className="ml-4 text-muted transition group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-muted">{it.a}</p>
        </details>
      ))}
    </div>
  );
}

export function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
      {subtitle && <p className="mt-2 text-muted">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}
