import { Link } from "react-router";
import { getGames, getSite } from "~/lib/catalog";
import { buildWaContactLink } from "~/lib/whatsapp";

export function Navbar() {
  const site = getSite();
  const games = getGames();
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="text-lg font-extrabold tracking-tight">
          {site.brand}
        </Link>
        <div className="flex items-center gap-4 text-sm text-muted">
          {games.slice(0, 3).map((g) => (
            <Link key={g.slug} to={`/joki/${g.slug}`} className="hidden hover:text-white sm:block">
              {g.name}
            </Link>
          ))}
          <Link to="/cara-order" className="hover:text-white">
            Cara Order
          </Link>
          <a
            href={buildWaContactLink(site.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-wa px-3 py-1.5 font-semibold text-black"
          >
            WhatsApp
          </a>
        </div>
      </nav>
    </header>
  );
}

export function Footer() {
  const site = getSite();
  return (
    <footer className="mt-12 border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:justify-between">
        <div>
          <p className="font-semibold text-white">{site.brand}</p>
          <p>Jam operasional {site.hours}</p>
          <p>Pembayaran: {site.payment.join(" · ")}</p>
        </div>
        <div className="flex flex-col gap-1">
          <Link to="/cara-order" className="hover:text-white">Cara Order</Link>
          <Link to="/syarat-ketentuan" className="hover:text-white">Syarat & Ketentuan</Link>
          {site.instagram && (
            <a className="hover:text-white" href={`https://instagram.com/${site.instagram}`} target="_blank" rel="noopener noreferrer">
              Instagram @{site.instagram}
            </a>
          )}
          {site.tiktok && (
            <a className="hover:text-white" href={`https://tiktok.com/@${site.tiktok}`} target="_blank" rel="noopener noreferrer">
              TikTok @{site.tiktok}
            </a>
          )}
        </div>
      </div>
      <p className="px-4 pb-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} {site.brand}. Tidak berafiliasi dengan publisher game mana pun.
      </p>
    </footer>
  );
}

export function FloatingWA() {
  const site = getSite();
  return (
    <a
      href={buildWaContactLink(site.whatsapp)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat via WhatsApp"
      className="fixed right-4 bottom-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-wa text-black shadow-lg shadow-black/40 transition hover:scale-105"
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.2 14.2c-.2.6-1.300 1.200-1.800 1.200-.5.100-1 .2-3.200-.7-2.700-1.100-4.400-3.800-4.600-4-.1-.2-1.100-1.500-1.100-2.800s.7-2 1-2.300c.2-.3.500-.3.700-.3h.5c.2 0 .4 0 .6.500l.8 1.900c.1.200.1.400 0 .5l-.3.500-.4.400c-.1.200-.3.300-.1.600.2.300.8 1.300 1.700 2.100 1.100 1 2.100 1.300 2.400 1.500.3.100.5.100.6-.1l.9-1.100c.2-.3.400-.2.600-.1l1.800.9c.3.100.5.200.5.300.1.200.1.800-.1 1.400Z" />
      </svg>
    </a>
  );
}
