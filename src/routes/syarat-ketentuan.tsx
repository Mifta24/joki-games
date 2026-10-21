import { Card, Section } from "~/components/ui";
import { getSite } from "~/lib/catalog";

export function meta() {
  return [
    { title: `Syarat & Ketentuan | ${getSite().brand}` },
    { name: "description", content: "Syarat dan ketentuan layanan joki, risiko terhadap akun game, dan kebijakan refund." },
  ];
}

// DRAFT: isi ini placeholder, tolong ditinjau dan disesuaikan sebelum website online.
const sections: { title: string; items: string[] }[] = [
  {
    title: "Risiko terhadap akun",
    items: [
      "Joki dapat melanggar ketentuan layanan (ToS) sebagian game. Pemilik akun menanggung risiko sanksi, termasuk pembatasan atau pemblokiran akun.",
      "Kami tidak memakai cheat, hack, atau tool ilegal.",
      "Dengan melakukan order, kamu menyatakan memahami dan menerima risiko ini.",
    ],
  },
  {
    title: "Harga & pembayaran",
    items: [
      "Harga di website adalah estimasi. Harga final dikonfirmasi admin sebelum pembayaran.",
      "Pengerjaan dimulai setelah pembayaran dikonfirmasi.",
    ],
  },
  {
    title: "Data akun",
    items: [
      "Data akun hanya diserahkan lewat chat WhatsApp resmi.",
      "Jangan login ke akun selama pengerjaan berlangsung.",
      "Ganti password setelah order selesai.",
    ],
  },
  {
    title: "Refund",
    items: [
      "[PERLU DIISI PEMILIK] Tentukan kebijakan: kapan refund penuh, kapan sebagian, dan kapan tidak bisa.",
    ],
  },
];

export default function Syarat() {
  return (
    <Section title="Syarat & Ketentuan">
      <div className="space-y-4">
        {sections.map((s) => (
          <Card key={s.title}>
            <h2 className="font-bold">{s.title}</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
              {s.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </Section>
  );
}
