import { Link } from "react-router";
import { Accordion, Button, Card, Section } from "~/components/ui";
import { getFaq, getGames, getSite, getStartingPrice, getTestimonials } from "~/lib/catalog";
import { formatRupiah } from "~/lib/format";
import { buildWaContactLink } from "~/lib/whatsapp";

export function meta() {
  const { brand } = getSite();
  return [
    { title: `Joki Game Murah & Aman | ${brand}` },
    { name: "description", content: `Layanan joki game dengan harga transparan. Cek harga lewat kalkulator, order langsung via WhatsApp. ${brand}.` },
    { property: "og:title", content: `Joki Game Murah & Aman | ${brand}` },
    { property: "og:image", content: `${getSite().url}/og/default.png` },
    { property: "og:type", content: "website" },
  ];
}

const steps = [
  { t: "Pilih game & hitung harga", d: "Buka halaman game, pakai kalkulator untuk lihat estimasi." },
  { t: "Klik Order via WhatsApp", d: "Pesan sudah terisi otomatis, tinggal kirim ke admin." },
  { t: "Konfirmasi & mulai", d: "Admin konfirmasi harga, kamu bayar, lalu pengerjaan dimulai." },
];

const reasons = [
  ["Harga transparan", "Semua harga tampil di website, tidak ada biaya tersembunyi."],
  ["Tanpa form login", "Data akun tidak pernah diminta lewat website."],
  ["Update via chat", "Progres diinfokan langsung lewat WhatsApp."],
  ["Respon cepat", "Admin online setiap hari di jam operasional."],
];

export default function Home() {
  const site = getSite();
  const games = getGames();
  const testimonials = getTestimonials();

  return (
    <>
      <section className="mx-auto max-w-5xl px-4 pt-16 pb-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Joki game <span className="text-brand">cepat & transparan</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          Cek harga sendiri lewat kalkulator, order lewat WhatsApp dalam 3 klik.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="#game">Lihat Game</Button>
          <Button href={buildWaContactLink(site.whatsapp)} variant="wa" external>
            Chat WhatsApp
          </Button>
        </div>
      </section>

      <div id="game">
        <Section title="Game yang kami layani" subtitle="Pilih game untuk melihat price list dan kalkulator.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((g) => (
              <Link key={g.slug} to={`/joki/${g.slug}`}>
                <Card className="h-full transition hover:border-brand">
                  <h3 className="text-lg font-bold">{g.name}</h3>
                  <p className="mt-1 text-sm text-muted">{g.services.map((s) => s.name).join(" · ")}</p>
                  <p className="mt-4 text-sm">
                    Mulai dari <span className="font-semibold">{formatRupiah(getStartingPrice(g))}</span>
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </Section>
      </div>

      <Section title="Kenapa pilih kami">
        <div className="grid gap-4 sm:grid-cols-2">
          {reasons.map(([t, d]) => (
            <Card key={t}>
              <h3 className="font-bold">{t}</h3>
              <p className="mt-1 text-sm text-muted">{d}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Cara order">
        <ol className="grid gap-4 sm:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.t}>
              <Card className="h-full">
                <span className="text-sm font-bold text-brand">Langkah {i + 1}</span>
                <h3 className="mt-1 font-bold">{s.t}</h3>
                <p className="mt-1 text-sm text-muted">{s.d}</p>
              </Card>
            </li>
          ))}
        </ol>
      </Section>

      {testimonials.length > 0 && (
        <Section title="Testimoni">
          <div className="grid gap-4 sm:grid-cols-2">
            {testimonials.map((t, i) => (
              <Card key={i}>
                {t.image && <img src={t.image} alt={`Testimoni ${t.name}`} loading="lazy" className="mb-3 rounded-lg" />}
                {t.text && <p className="text-sm">“{t.text}”</p>}
                <p className="mt-2 text-xs text-muted">{t.name} · {t.game}</p>
              </Card>
            ))}
          </div>
        </Section>
      )}

      <Section title="Pertanyaan umum">
        <Accordion items={getFaq()} />
      </Section>

      <section className="mx-auto max-w-5xl px-4 py-12 text-center">
        <h2 className="text-2xl font-bold">Siap naik rank?</h2>
        <Button href={buildWaContactLink(site.whatsapp)} variant="wa" external className="mt-5">
          Tanya Admin via WhatsApp
        </Button>
      </section>
    </>
  );
}
