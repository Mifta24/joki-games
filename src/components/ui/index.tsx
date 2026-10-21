import type { ReactNode } from "react";
import { Link } from "react-router";

type ButtonProps = {
  to?: string;
  href?: string;
  children: ReactNode;
  variant?: "primary" | "outline";
};

/** Tombol bergaya prototype. `to` = link internal, `href` = link luar (WhatsApp). */
export function Button({ to, href, children, variant = "primary" }: ButtonProps) {
  const cls = `button ${variant}`;
  if (to) return <Link to={to} className={cls}>{children}</Link>;
  return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a>;
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <section className="faq" id="faq">
      <div className="wrap faq-layout">
        <h2>Yang perlu<br />kamu tahu.</h2>
        <div>
          {items.map((it) => (
            <details key={it.q}>
              <summary>{it.q}</summary>
              <p>{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  ["Pilih game & layanan", "Lihat opsi yang benar-benar tersedia, lalu atur jumlah atau rank yang kamu tuju."],
  ["Cek estimasi", "Harga berubah sesuai pilihan. Baca ringkasannya sebelum lanjut ke chat."],
  ["Konfirmasi lewat WA", "Klik tombol order, pesan terisi otomatis. Konfirmasi harga final dan metode bayar di chat admin."],
];

export function Steps({ withTitle = true }: { withTitle?: boolean }) {
  return (
    <section className="steps" id="cara-order">
      <div className="wrap">
        {withTitle && <h2>Order tanpa tebak-tebakan.</h2>}
        <div className="step-grid">
          {steps.map(([t, d], i) => (
            <div className="step" key={t}>
              <span className="n">{String(i + 1).padStart(2, "0")}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
        <div className="caution">
          <strong>Catatan penting</strong>
          <span>
            Jasa joki dapat melanggar aturan game dan berisiko pada akun. Baca Syarat &amp; Ketentuan sebelum order.
            Website ini tidak pernah meminta username, password, atau kode verifikasi.
          </span>
        </div>
      </div>
    </section>
  );
}
