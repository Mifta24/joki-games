import { Button, Steps } from "~/components/ui";
import { getGames, getSite } from "~/lib/catalog";
import { buildWaContactLink } from "~/lib/whatsapp";

export function meta() {
  return [
    { title: `Cara Order Joki | ${getSite().brand}` },
    { name: "description", content: "Langkah order joki lewat WhatsApp, metode pembayaran, dan tips keamanan akun." },
  ];
}

export default function CaraOrder() {
  const site = getSite();
  const first = getGames()[0];
  return (
    <>
      <div className="wrap page-head"><h1>Cara order.</h1></div>
      <Steps withTitle={false} />
      <div className="wrap" style={{ paddingBottom: 76 }}>
        <div className="info-grid">
          <div className="info">
            <h2>Pembayaran</h2>
            {site.qris && (
              <>
                <img
                  src={site.qris}
                  alt="QRIS pembayaran atas nama Bom Joki"
                  width={260}
                  style={{ display: "block", maxWidth: "100%", height: "auto", marginBottom: 8 }}
                  loading="lazy"
                />
                <p style={{ marginBottom: 14 }}>QRIS tercatat atas nama <b>BOM JOKI</b> (satu pemilik dengan Snow Joki).</p>
              </>
            )}
            <p>Metode: {site.payment.join(" · ")}. Atas nama {site.accounts[0]?.holder ?? "admin"}.</p>
            <ul style={{ marginTop: 12 }}>
              {site.accounts.map((a) => (
                <li key={a.method}><b>{a.method}</b>: {a.number}</li>
              ))}
              {site.paymentLinks.map((l) => (
                <li key={l.url}><b>{l.label}</b>: <a href={l.url} target="_blank" rel="noopener noreferrer">{l.url.replace("https://", "")}</a></li>
              ))}
            </ul>
            <p style={{ marginTop: 12 }}><b>Penting:</b> setelah membayar, kirim bukti transfer ke admin lewat WhatsApp agar pesanan segera diproses. QRIS dikirim admin lewat chat.</p>
          </div>
          <div className="info">
            <h2>Keamanan akun</h2>
            <ul>
              <li>Website ini tidak pernah meminta password atau data login.</li>
              <li>Data akun hanya dikirim ke admin resmi lewat WhatsApp.</li>
              <li>Ganti password setelah order selesai.</li>
              <li>Aktifkan verifikasi 2 langkah jika game mendukung.</li>
            </ul>
          </div>
        </div>
        <div className="hero-actions" style={{ marginTop: 28 }}>
          {first && <Button to={`/joki/${first.slug}`}>Hitung harga <span aria-hidden="true">↗</span></Button>}
          <Button href={buildWaContactLink(site.whatsapp)} variant="outline">Tanya admin via WhatsApp</Button>
        </div>
      </div>
    </>
  );
}
