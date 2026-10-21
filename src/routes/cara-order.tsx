import { Button, Card, Section } from "~/components/ui";
import { getSite } from "~/lib/catalog";
import { buildWaContactLink } from "~/lib/whatsapp";

export function meta() {
  return [
    { title: `Cara Order Joki | ${getSite().brand}` },
    { name: "description", content: "Langkah order joki lewat WhatsApp, metode pembayaran, dan tips keamanan akun." },
  ];
}

export default function CaraOrder() {
  const site = getSite();
  return (
    <>
      <Section title="Cara order" subtitle="Dari pilih layanan sampai pengerjaan dimulai.">
        <ol className="space-y-3">
          {[
            "Buka halaman game, pilih layanan, dan hitung estimasi harga.",
            "Klik “Order via WhatsApp”. Pesan berisi detail order terisi otomatis.",
            "Admin mengonfirmasi harga final dan estimasi waktu di chat.",
            "Lakukan pembayaran sesuai instruksi admin.",
            "Kirim data akun lewat chat WhatsApp (bukan lewat website), lalu pengerjaan dimulai.",
            "Admin menginfokan progres dan memberi tahu saat selesai.",
          ].map((t, i) => (
            <li key={i}>
              <Card className="flex gap-4">
                <span className="font-bold text-brand">{i + 1}</span>
                <span className="text-sm">{t}</span>
              </Card>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Metode pembayaran">
        <Card>
          <p className="text-sm">{site.payment.join(" · ")}</p>
          <p className="mt-2 text-xs text-muted">Detail rekening / QRIS dikirim admin lewat chat setelah harga disepakati.</p>
        </Card>
      </Section>

      <Section title="Keamanan akun">
        <Card>
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted">
            <li>Website ini tidak pernah meminta password atau data login.</li>
            <li>Data akun hanya dikirim ke admin resmi lewat WhatsApp {site.brand}.</li>
            <li>Ganti password setelah order selesai.</li>
            <li>Aktifkan verifikasi 2 langkah jika game mendukung.</li>
          </ul>
        </Card>
        <Button href={buildWaContactLink(site.whatsapp)} variant="wa" external className="mt-6">
          Mulai order via WhatsApp
        </Button>
      </Section>
    </>
  );
}
