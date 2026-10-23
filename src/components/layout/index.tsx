import { Link } from "react-router";
import { getGames, getSite } from "~/lib/catalog";
import { buildWaContactLink } from "~/lib/whatsapp";

/** "Snow Joki" -> SNOW + JOKI (kata terakhir berwarna lime). */
function Wordmark({ brand }: { brand: string }) {
  const parts = brand.match(/[A-Z][a-z0-9]*/g) ?? [brand];
  const head = parts.slice(0, -1).join("").toUpperCase();
  const tail = parts[parts.length - 1].toUpperCase();
  return (
    <>
      {head}
      <span>{tail}</span>
      {head && <span style={{ color: "#f5f7ed" }}>.</span>}
    </>
  );
}

export function Navbar() {
  const { brand } = getSite();
  const first = getGames()[0];
  const calcHref = first ? `/joki/${first.slug}` : "/";
  return (
    <header>
      <div className="wrap">
        <Link className="wordmark" to="/" aria-label={`${brand}, ke beranda`}>
          <Wordmark brand={brand} />
        </Link>
        <nav aria-label="Navigasi utama">
          <Link to="/#game">Pilih game</Link>
          <Link to={calcHref}>Cek harga</Link>
          <Link to="/cara-order">Cara order</Link>
          <Link to="/#faq">FAQ</Link>
        </nav>
        <Link to={calcHref} className="nav-cta">Cek harga ↗</Link>
      </div>
    </header>
  );
}

export function Footer() {
  const site = getSite();
  const first = getGames()[0];
  return (
    <footer>
      <div className="wrap footer-row">
        <div>
          <Link className="wordmark" to="/"><Wordmark brand={site.brand} /></Link>
          <br />
          <small>
            Jam operasional {site.hours} · Pembayaran: {site.payment.join(", ")}.
            <br />
            Tidak berafiliasi dengan publisher game mana pun.
          </small>
        </div>
        <div className="footer-links">
          {first && <Link to={`/joki/${first.slug}`}>Cek harga</Link>}
          <Link to="/cara-order">Cara order</Link>
          <Link to="/syarat-ketentuan">Syarat &amp; ketentuan</Link>
          {site.testimonialUrl && <a href={site.testimonialUrl} target="_blank" rel="noopener noreferrer">Testimoni</a>}
          {site.socials.map((s) => (
            <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer">{s.platform} {s.label}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export function FloatingWA() {
  const { whatsapp } = getSite();
  return (
    <a
      className="fab-wa"
      href={buildWaContactLink(whatsapp)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat via WhatsApp"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.2 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.2-.7-2.700-1.100-4.400-3.800-4.600-4-.1-.2-1.100-1.500-1.100-2.800s.7-2 1-2.300c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.900c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.300 1.700 2.100 1.100 1 2.100 1.300 2.400 1.500.3.1.5.1.6-.1l.9-1.100c.2-.3.4-.2.6-.1l1.800.9c.3.1.5.2.5.3.1.2.1.8-.1 1.400Z" />
      </svg>
    </a>
  );
}
