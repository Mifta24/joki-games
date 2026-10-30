import { Link } from "react-router";
import { Button, Faq, Steps } from "~/components/ui";
import { getFaq, getGames, getSite, getTestimonials } from "~/lib/catalog";

export function meta() {
  const { brand, url } = getSite();
  const title = `${brand} — Naik rank, tahu harga`;
  const description = "Pilih layanan joki, hitung estimasi harga langsung, lalu order lewat WhatsApp dengan pesan terisi otomatis.";
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: `${url}/og/default.png` },
    { property: "og:type", content: "website" },
  ];
}

export default function Home() {
  const games = getGames();
  const testimonials = getTestimonials();
  const first = games[0];
  const calcHref = first ? `/joki/${first.slug}` : "/";

  return (
    <>
      <section className="hero" id="home">
        <div className="wrap">
          <div className="hero-copy">
            <span className="badge"><i aria-hidden="true" /> Harga terlihat sebelum kamu chat</span>
            <h1>NAIK RANK.<br /><span>TAHU HARGA.</span></h1>
            <p className="hero-desc">
              Pilih layanan, atur target, dan lihat estimasinya langsung. Kalau cocok, kirim ringkasan order ke WhatsApp untuk konfirmasi akhir.
            </p>
            <div className="hero-actions">
              <Button to={calcHref}>Hitung harga <span aria-hidden="true">↗</span></Button>
              <a href="#game" className="button outline">Lihat game</a>
            </div>
            <div className="hero-note">
              <span><b>01</b> Pilih layanan</span>
              <span><b>02</b> Lihat estimasi</span>
              <span><b>03</b> Chat admin</span>
            </div>
          </div>
          <div className="hero-art" aria-label="Ilustrasi tipografi rank Mythic, bukan logo game">
            <div className="art-panel">
              <div className="art-top"><span>{getSite().brand.toUpperCase()} / MATCH DESK</span><span>MLBB — 01</span></div>
              <div className="art-slash" />
              <div className="art-stars" aria-hidden="true">★ ★ ★</div>
              <div className="art-rank">MYTHIC<small>Targetmu. Harganya jelas.</small></div>
              <div className="art-stamp">ESTIMASI LANGSUNG</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section wrap" id="game">
        <div className="section-head">
          <h2>Pilih arena.</h2>
          <p>Layanan joki Mobile Legends: rank, gendong, dan full grading. Harga langsung terlihat di kalkulator.</p>
        </div>
        <div className="game-list">
          {games.map((g, i) => (
            <Link key={g.slug} className="game" to={`/joki/${g.slug}`} aria-label={`Lihat layanan ${g.name}`}>
              <span className="mini">{String(i + 1).padStart(2, "0")} / LAYANAN TERSEDIA</span>
              <strong>{g.name}</strong>
              <span className="go">Lihat layanan <span aria-hidden="true">↗</span></span>
            </Link>
          ))}
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="section wrap" style={{ paddingTop: 0 }}>
          <div className="section-head"><h2>Kata mereka.</h2></div>
          <div className="testi-grid">
            {testimonials.map((t, i) => (
              <figure className="testi" key={i} style={{ margin: 0 }}>
                {t.image && <img src={t.image} alt={`Testimoni ${t.name}`} loading="lazy" />}
                {t.text && <blockquote style={{ margin: 0 }}>“{t.text}”</blockquote>}
                <small>{t.name} · {t.game}</small>
              </figure>
            ))}
          </div>
        </section>
      )}

      <Steps />
      <Faq items={getFaq()} />
    </>
  );
}
