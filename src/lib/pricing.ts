import type { Tier } from "./schema";

/**
 * Satu posisi di tangga rank. `star` dihitung dari 0 = jumlah bintang yang sudah dimiliki
 * di divisi tersebut (Epic III ★2 = di Epic III dengan 2 bintang).
 * Posisi terakhir (index = total bintang) adalah "puncak" rank, supaya rank maksimum bisa jadi tujuan.
 */
export type RankPosition = {
  tier: number;
  division: number;
  star: number;
  label: string;
  /** true hanya untuk posisi puncak */
  isMax?: boolean;
};

export function totalStars(tiers: Tier[]): number {
  return tiers.reduce((n, t) => n + t.divisions.length * t.starsPerDivision, 0);
}

/** Daftar semua posisi berurutan dari bawah ke atas, ditambah satu posisi puncak. */
export function listPositions(tiers: Tier[]): RankPosition[] {
  const out: RankPosition[] = [];
  tiers.forEach((t, ti) => {
    t.divisions.forEach((div, di) => {
      for (let s = 0; s < t.starsPerDivision; s++) {
        const name = div === "-" ? t.name : `${t.name} ${div}`;
        out.push({ tier: ti, division: di, star: s, label: `${name} ★${s}` });
      }
    });
  });
  const last = tiers[tiers.length - 1];
  out.push({
    tier: tiers.length - 1,
    division: last.divisions.length - 1,
    star: last.starsPerDivision,
    label: `${last.name} (puncak)`,
    isMax: true,
  });
  return out;
}

/** Index posisi dalam daftar `listPositions`. */
export function positionIndex(tiers: Tier[], p: { tier: number; division: number; star: number }): number {
  const before = tiers.slice(0, p.tier).reduce((n, t) => n + t.divisions.length * t.starsPerDivision, 0);
  return before + p.division * tiers[p.tier].starsPerDivision + p.star;
}

/**
 * Harga naik dari index `from` ke index `to` (0..totalStars).
 * Tujuan harus di atas posisi awal, kalau tidak hasilnya 0.
 */
export function calcRankPrice(tiers: Tier[], from: number, to: number): number {
  const total = totalStars(tiers);
  const a = Math.max(0, Math.min(from, total));
  const b = Math.max(0, Math.min(to, total));
  if (b <= a) return 0;

  let price = 0;
  let cursor = 0;
  for (const t of tiers) {
    const size = t.divisions.length * t.starsPerDivision;
    const start = Math.max(a, cursor);
    const end = Math.min(b, cursor + size);
    if (end > start) price += (end - start) * t.pricePerStar;
    cursor += size;
  }
  return price;
}

export function calcUnitPrice(price: number, qty: number, min = 1): number {
  if (!Number.isFinite(qty) || qty < min) return 0;
  return price * Math.floor(qty);
}
