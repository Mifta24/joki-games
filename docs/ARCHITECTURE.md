# Arsitektur Website Joki Games

> Status: draft v1 · Nama brand masih placeholder: **JokiKu**
> Scope: website frontend saja (tanpa backend). Order diproses lewat WhatsApp.

---

## 1. Ringkasan Proyek

**Deskripsi**
JokiKu adalah website katalog jasa joki game. Pengunjung bisa melihat game yang dilayani, cek harga lewat kalkulator, lalu order lewat WhatsApp dengan pesan yang sudah terisi otomatis. Pembayaran, koordinasi login akun, dan update progres dilakukan manual lewat chat.

**Tujuan**
1. Menampilkan layanan dan harga dengan jelas dan meyakinkan, supaya pengunjung percaya.
2. Mengubah pengunjung jadi chat WA secepat mungkin, maksimal 3 klik.
3. Biaya operasional Rp0 (hosting statis gratis).
4. Siap di-upgrade ke backend (Laravel API) tanpa membuang kode frontend.

**Target pengguna**
- Pemain game mobile/PC usia 15–30 tahun, yang sebagian besar membuka dari HP.
- Datang dari TikTok, Instagram, grup WA/Discord, dan Google.

**In scope (v1)**
- Katalog game dan layanan.
- Price list dan kalkulator harga.
- Order lewat WhatsApp deep link.
- Testimoni, FAQ, cara order, info pembayaran, dan S&K.

**Out of scope (v1)**
- Pembayaran otomatis, akun member, lacak order, panel penjoki.
- Form apa pun yang meminta data login akun game.

---

## 2. Tech Stack

- **React 19 + TypeScript:** skill yang sudah dikuasai, dan type-safe untuk data harga.
- **Vite:** build cepat, hasilnya file statis.
- **React Router v7:** routing per halaman game. Bisa *prerender* ke HTML statis untuk SEO.
- **Tailwind CSS v4:** styling cepat dan konsisten, dengan ukuran CSS kecil.
- **Zod:** memvalidasi `games.json` saat build, supaya salah ketik harga ketahuan sebelum online.
- **Vitest:** unit test untuk logika kalkulator harga, bagian paling kritis.
- **Cloudflare Pages:** hosting statis gratis, CDN global, SSL, dan deploy otomatis dari GitHub.

**Kenapa tidak pakai yang lain**
- **Next.js:** fitur SSR/server tidak dibutuhkan. Lebih kompleks tanpa manfaat.
- **WordPress:** berat, harus update terus, dan rawan diserang untuk sekadar menampilkan info.
- **Astro:** sebenarnya pilihan valid, tapi tim memilih tetap di React. SEO ditutup lewat prerender (lihat bagian 9).

---

## 3. Arsitektur High-Level

```
 ┌──────────────┐     HTTPS      ┌─────────────────────────┐
 │  Pengunjung  │ ─────────────▶ │  Cloudflare Pages (CDN) │
 │  (HP/Browser)│ ◀───────────── │  HTML/CSS/JS statis     │
 └──────┬───────┘                └───────────┬─────────────┘
        │                                    │ dibuild dari
        │ klik "Order via WA"                │
        ▼                                    ▼
 ┌──────────────┐                ┌─────────────────────────┐
 │  WhatsApp    │                │  Repo GitHub            │
 │  wa.me/62..  │                │  src/ + data/games.json │
 │  (admin)     │                │  push → auto deploy     │
 └──────────────┘                └─────────────────────────┘
```

**Prinsip arsitektur**
1. **Data terpisah dari UI.** Semua game, tier, dan harga ada di `src/data/*.json`. Ganti harga tidak perlu menyentuh komponen.
2. **Data diakses lewat satu pintu.** Komponen tidak pernah import JSON langsung, tapi lewat `src/lib/catalog.ts`. Nanti kalau pindah ke API, cukup file ini yang diubah.
3. **Logika harga berupa pure function.** Tidak bergantung ke React, sehingga gampang di-test dan bisa dipakai ulang di backend nanti.
4. **Tanpa state server.** Website tidak menyimpan data pengunjung sama sekali.

---

## 4. Struktur Folder

```
joki-games/
├── docs/
│   └── ARCHITECTURE.md
├── public/
│   ├── images/games/          # logo/cover game (webp)
│   ├── og/                    # gambar preview link WA/IG (1200x630)
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── data/
│   │   ├── site.json          # nama brand, nomor WA, sosmed, jam operasional
│   │   ├── games.json         # game + layanan + tier + harga
│   │   ├── testimonials.json
│   │   └── faq.json
│   ├── lib/
│   │   ├── schema.ts          # Zod schema + TS types
│   │   ├── catalog.ts         # getGames(), getGame(slug)  ← satu pintu data
│   │   ├── pricing.ts         # calcPrice() — pure function
│   │   ├── whatsapp.ts        # buildWaLink(order)
│   │   └── format.ts          # formatRupiah()
│   ├── components/
│   │   ├── layout/            # Navbar, Footer, FloatingWA
│   │   ├── home/              # Hero, GameGrid, WhyUs, HowToOrder
│   │   ├── game/              # PriceTable, PriceCalculator, ServiceTabs
│   │   └── ui/                # Button, Card, Badge, Accordion
│   ├── routes/
│   │   ├── home.tsx                 # /
│   │   ├── game.tsx                 # /joki/:slug
│   │   ├── cara-order.tsx           # /cara-order
│   │   ├── syarat-ketentuan.tsx     # /syarat-ketentuan
│   │   └── not-found.tsx
│   ├── root.tsx               # layout global + meta default
│   ├── routes.ts              # definisi route
│   └── styles.css             # Tailwind + design tokens
├── tests/
│   └── pricing.test.ts
├── react-router.config.ts     # prerender: semua route statis
├── vite.config.ts
├── package.json
└── tsconfig.json
```

---

## 5. Model Data

### 5.1 `site.json`
```json
{
  "brand": "JokiKu",
  "whatsapp": "6281234567890",
  "instagram": "jokiku.id",
  "tiktok": "jokiku.id",
  "hours": "09:00–23:00 WIB",
  "payment": ["QRIS", "BCA", "DANA", "GoPay"]
}
```

### 5.2 `games.json`
Ada tiga tipe layanan supaya fleksibel:
- **`rank`:** dari rank A ke rank B, dihitung per bintang (pakai kalkulator).
- **`per_unit`:** harga × jumlah, misalnya per match classic atau per win.
- **`package`:** harga tetap, misalnya paket event atau push winrate.

```json
[
  {
    "slug": "mobile-legends",
    "name": "Mobile Legends",
    "cover": "/images/games/mlbb.webp",
    "active": true,
    "services": [
      {
        "id": "ml-rank",
        "type": "rank",
        "name": "Joki Rank",
        "eta": "1–3 hari",
        "tiers": [
          { "name": "Epic",    "divisions": ["V","IV","III","II","I"], "starsPerDivision": 5, "pricePerStar": 7000 },
          { "name": "Legend",  "divisions": ["V","IV","III","II","I"], "starsPerDivision": 5, "pricePerStar": 9000 },
          { "name": "Mythic",  "divisions": ["-"], "starsPerDivision": 25, "pricePerStar": 15000 }
        ]
      },
      { "id": "ml-classic", "type": "per_unit", "name": "Joki Classic", "unit": "win", "price": 4000, "min": 5 },
      { "id": "ml-wr",      "type": "package",  "name": "Paket Winrate 70%", "price": 150000 }
    ]
  }
]
```

### 5.3 Types (`src/lib/schema.ts`)
```ts
import { z } from "zod";

export const Tier = z.object({
  name: z.string(),
  divisions: z.array(z.string()).min(1),
  starsPerDivision: z.number().int().positive(),
  pricePerStar: z.number().int().nonnegative(),
});

export const Service = z.discriminatedUnion("type", [
  z.object({ id: z.string(), type: z.literal("rank"), name: z.string(), eta: z.string().optional(), tiers: z.array(Tier).min(1) }),
  z.object({ id: z.string(), type: z.literal("per_unit"), name: z.string(), unit: z.string(), price: z.number().int(), min: z.number().int().default(1) }),
  z.object({ id: z.string(), type: z.literal("package"), name: z.string(), price: z.number().int() }),
]);

export const Game = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  cover: z.string(),
  active: z.boolean(),
  services: z.array(Service).min(1),
});

export type Game = z.infer<typeof Game>;
export type Service = z.infer<typeof Service>;
```

---

## 6. Halaman & Routing

| Route | Isi | Tujuan |
|---|---|---|
| `/` | Hero, grid game, kenapa kami, cara order (3 langkah), testimoni, FAQ, CTA | Membangun kepercayaan, lalu arahkan ke halaman game |
| `/joki/:slug` | Tab layanan, price table, kalkulator, estimasi waktu, tombol WA | Konversi utama |
| `/cara-order` | Langkah order, metode bayar, keamanan akun | Mengurangi keraguan |
| `/syarat-ketentuan` | S&K, risiko ToS game, kebijakan refund | Perlindungan hukum dan ekspektasi |
| `*` | 404 + link ke home | — |

Halaman `/joki/:slug` dibuat otomatis untuk setiap game yang `active: true`.

---

## 7. Komponen Utama

- **`Navbar`:** logo, menu game, tombol WA.
- **`FloatingWA`:** tombol WA melayang di semua halaman, karena pengunjung kebanyakan dari HP.
- **`GameGrid`:** kartu game dari `getGames()`.
- **`ServiceTabs`:** berpindah antar layanan per game.
- **`PriceTable`:** price list per tier, dibaca dari data.
- **`PriceCalculator`:** pilih rank awal dan tujuan (atau jumlah), lalu harga live dan tombol "Order via WA".
- **`Testimonials`:** dari `testimonials.json`. Isinya screenshot asli dari pelanggan, bukan karangan.
- **`FAQ`:** accordion dari `faq.json`.

---

## 8. Logika Inti

### 8.1 Kalkulator rank (`src/lib/pricing.ts`)
Semua tier di-*flatten* jadi daftar bintang berurutan. Harga adalah jumlah `pricePerStar` dari setiap bintang di antara posisi awal dan tujuan.

```ts
type Pos = { tier: number; division: number; star: number };

export function calcRankPrice(tiers: Tier[], from: Pos, to: Pos): number {
  const steps = tiers.flatMap((t) =>
    Array.from({ length: t.divisions.length * t.starsPerDivision }, () => t.pricePerStar)
  );
  const idx = (p: Pos) =>
    tiers.slice(0, p.tier).reduce((n, t) => n + t.divisions.length * t.starsPerDivision, 0) +
    p.division * tiers[p.tier].starsPerDivision + p.star;

  const a = idx(from), b = idx(to);
  if (b <= a) return 0;                 // tujuan harus di atas posisi awal
  return steps.slice(a, b).reduce((s, x) => s + x, 0);
}
```
Test wajib: rank yang sama, lintas tier, posisi tujuan di bawah posisi awal, dan rank maksimum.

### 8.2 Link WhatsApp (`src/lib/whatsapp.ts`)
```ts
export function buildWaLink(phone: string, lines: string[]): string {
  const text = ["Halo, saya mau order joki:", ...lines].join("\n");
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
// lines: ["Game: Mobile Legends", "Layanan: Joki Rank",
//         "Dari: Epic III ★2 → Legend V", "Estimasi: Rp 91.000"]
// (13 bintang Epic × Rp 7.000 = Rp 91.000, sesuai contoh games.json)
```
Harga di pesan WA hanya **estimasi**. Harga final tetap dikonfirmasi admin di chat, karena orang bisa mengubah teks pesan sebelum dikirim.

---

## 9. SEO & Performa

1. **Prerender** semua route jadi HTML statis saat build (`react-router.config.ts`: `ssr: false, prerender: true`). Google dan preview link WA/IG langsung bisa membaca isinya.
2. **Meta per halaman:** title, description, dan Open Graph image per game, misalnya *"Joki Mobile Legends Murah & Aman | JokiKu"*.
3. **`sitemap.xml`** dibuat dari `games.json` saat build, plus `robots.txt`.
4. **Gambar** pakai WebP, `loading="lazy"`, dan `width`/`height` eksplisit supaya layout tidak bergeser saat gambar dimuat.
5. **Target Lighthouse mobile:** Performance ≥ 90, SEO ≥ 95.
6. **Budget JS:** di bawah 150 KB gzip. Hindari library berat seperti carousel atau animasi yang tidak perlu.

---

## 10. Keamanan

1. **Tidak ada form yang meminta kredensial akun game.** Data login diminta di chat WA, lalu pelanggan diingatkan untuk ganti password setelah order selesai.
2. **Tidak ada secret di frontend.** Semua yang ada di bundle bisa dilihat publik, termasuk nomor WA. Itu wajar.
3. **Security header** lewat file `_headers` Cloudflare: `Content-Security-Policy`, `X-Frame-Options: DENY`, `Referrer-Policy`.
4. **Dependency** dicek dengan `npm audit` di CI, dan versi dikunci lewat `package-lock.json`.
5. **Data divalidasi Zod saat build.** Kalau harga negatif atau ada field yang hilang, build gagal dan tidak ter-deploy.

---

## 11. Deployment & Workflow

```
edit games.json / kode  →  git push (main)  →  Cloudflare Pages build
  →  npm ci && npm run test && npm run build  →  deploy ke CDN (± 1 menit)
```
- **Branch `main`** langsung ke production. Branch lain mendapat *preview URL* otomatis untuk dicek sebelum di-merge.
- **Domain:** beli `.com`/`.id` lalu arahkan ke Cloudflare. SSL otomatis.
- **Rollback:** pilih deployment sebelumnya di dashboard Cloudflare, cukup satu klik.

**Script `package.json`**
```
dev        vite dev
build      react-router build
test       vitest run
lint       eslint . && tsc --noEmit
```

---

## 12. Roadmap Upgrade ke Backend

Begitu order sudah ramai, frontend ini tidak perlu dibuang:

1. **Fase 2:** buat **Laravel API** (`GET /api/games`). `catalog.ts` diubah dari membaca JSON jadi `fetch()`, tanpa mengubah komponen.
2. **Fase 3:** tambah checkout, payment gateway (QRIS), dan halaman lacak order. Mulai fase ini kredensial akun disimpan **terenkripsi** di backend dan dihapus otomatis setelah order selesai.
3. **Fase 4:** panel admin dan penjoki (Filament), serta chatbot AI FAQ yang terhubung ke Core Engine.

Logika di `pricing.ts` bisa dipindah ke backend sebagai sumber kebenaran harga, sementara frontend tetap menampilkan estimasi.

---

## 13. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Joki melanggar ToS game, akun pelanggan bisa di-ban | Komplain, reputasi | S&K + disclaimer jelas, tanpa cheat/tool, kebijakan refund |
| Harga di JSON salah ketik | Rugi/komplain | Validasi Zod + unit test + preview URL sebelum merge |
| Nomor WA diblokir atau di-spam | Order berhenti | Pakai WA Business, simpan nomor di `site.json` (ganti cukup di satu tempat) |
| Testimoni palsu ketahuan | Kehilangan trust | Hanya pakai screenshot asli dengan izin pelanggan |
| SEO lambat naik | Traffic Google minim | Prerender + konten per game; andalkan sosmed di awal |

---

## 14. Estimasi Pengerjaan (solo)

1. **Hari 1:** setup Vite + React Router + Tailwind, schema Zod, data contoh, layout.
2. **Hari 2:** home, halaman game, price table.
3. **Hari 3:** kalkulator + test, link WA, FloatingWA.
4. **Hari 4:** cara order, S&K, SEO (meta, OG, sitemap), lalu deploy ke Cloudflare Pages.

**Definition of Done v1**
- Semua halaman berhasil di-prerender, dan Lighthouse mobile ≥ 90.
- Test kalkulator lolos, dan build gagal kalau data tidak valid.
- Tombol WA bekerja di Android dan iOS dengan pesan yang terisi otomatis.
- S&K dan disclaimer risiko akun sudah tampil.
