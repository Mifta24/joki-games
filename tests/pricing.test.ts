import { describe, expect, it } from "vitest";
import { buildWaLink } from "../src/lib/whatsapp";
import { calcRankPrice, calcUnitPrice, listPositions, positionIndex, totalStars } from "../src/lib/pricing";
import { Game } from "../src/lib/schema";
import type { Tier } from "../src/lib/schema";

const tiers: Tier[] = [
  { name: "Epic", divisions: ["V", "IV", "III", "II", "I"], starsPerDivision: 5, pricePerStar: 7000 },
  { name: "Legend", divisions: ["V", "IV", "III", "II", "I"], starsPerDivision: 5, pricePerStar: 9000 },
  { name: "Mythic", divisions: ["-"], starsPerDivision: 25, pricePerStar: 15000 },
];

describe("calcRankPrice", () => {
  it("0 kalau rank sama", () => {
    expect(calcRankPrice(tiers, 10, 10)).toBe(0);
  });

  it("0 kalau tujuan di bawah posisi awal", () => {
    expect(calcRankPrice(tiers, 30, 5)).toBe(0);
  });

  it("dalam satu tier", () => {
    // Epic III ★2 (idx 12) -> Epic II ★0 (idx 15) = 3 bintang
    const from = positionIndex(tiers, { tier: 0, division: 2, star: 2 });
    const to = positionIndex(tiers, { tier: 0, division: 3, star: 0 });
    expect(calcRankPrice(tiers, from, to)).toBe(3 * 7000);
  });

  it("lintas tier", () => {
    // Epic I ★3 (idx 23) -> Legend V ★2 (idx 27): 2 bintang Epic + 2 bintang Legend
    const from = positionIndex(tiers, { tier: 0, division: 4, star: 3 });
    const to = positionIndex(tiers, { tier: 1, division: 0, star: 2 });
    expect(calcRankPrice(tiers, from, to)).toBe(2 * 7000 + 2 * 9000);
  });

  it("seluruh tangga sampai puncak rank maksimum", () => {
    const total = totalStars(tiers);
    expect(total).toBe(25 + 25 + 25);
    expect(calcRankPrice(tiers, 0, total)).toBe(25 * 7000 + 25 * 9000 + 25 * 15000);
  });

  it("indeks di luar batas di-clamp", () => {
    const total = totalStars(tiers);
    expect(calcRankPrice(tiers, -5, total + 100)).toBe(calcRankPrice(tiers, 0, total));
  });
});

describe("listPositions", () => {
  it("jumlahnya total bintang + 1 posisi puncak", () => {
    const list = listPositions(tiers);
    expect(list).toHaveLength(totalStars(tiers) + 1);
    expect(list.at(-1)?.isMax).toBe(true);
  });

  it("index posisi konsisten dengan urutan list", () => {
    listPositions(tiers).forEach((p, i) => {
      if (!p.isMax) expect(positionIndex(tiers, p)).toBe(i);
    });
  });
});

describe("calcUnitPrice", () => {
  it("kali jumlah", () => expect(calcUnitPrice(4000, 5, 5)).toBe(20000));
  it("0 kalau di bawah minimum", () => expect(calcUnitPrice(4000, 3, 5)).toBe(0));
  it("0 kalau bukan angka", () => expect(calcUnitPrice(4000, Number.NaN, 1)).toBe(0));
});

describe("data asli", () => {
  it("games.json & site.json lolos schema", async () => {
    const games = (await import("../src/data/games.json")).default;
    const site = (await import("../src/data/site.json")).default;
    const { Site } = await import("../src/lib/schema");
    expect(() => games.forEach((g) => Game.parse(g))).not.toThrow();
    expect(() => Site.parse(site)).not.toThrow();
  });

  it("gendong per win: Legend 3 win = 21.000", () => {
    expect(calcUnitPrice(7000, 3, 1)).toBe(21000);
  });
});

describe("buildWaLink", () => {
  it("meng-encode pesan", () => {
    const url = buildWaLink("628123", ["Game: Mobile Legends"]);
    expect(url.startsWith("https://wa.me/628123?text=")).toBe(true);
    expect(decodeURIComponent(url.split("text=")[1])).toBe("Halo, saya mau order joki:\nGame: Mobile Legends");
  });
});

describe("schema", () => {
  it("menolak harga negatif", () => {
    const bad = {
      slug: "x", name: "X", active: true,
      services: [{ id: "a", type: "package", name: "A", price: -1 }],
    };
    expect(Game.safeParse(bad).success).toBe(false);
  });

  it("menolak slug tidak valid", () => {
    const bad = {
      slug: "Bad Slug", name: "X", active: true,
      services: [{ id: "a", type: "package", name: "A", price: 1 }],
    };
    expect(Game.safeParse(bad).success).toBe(false);
  });
});

import { describePosition, posFromIndex, starOptionCount } from "../src/lib/pricing";

describe("posFromIndex / describePosition", () => {
  it("bolak-balik dengan positionIndex", () => {
    for (let i = 0; i <= totalStars(tiers); i++) {
      const p = posFromIndex(tiers, i);
      expect(positionIndex(tiers, p)).toBe(i);
    }
  });
  it("label", () => {
    expect(describePosition(tiers, posFromIndex(tiers, 12))).toBe("Epic III ★2");
    expect(describePosition(tiers, posFromIndex(tiers, 25))).toBe("Legend V ★0");
    expect(describePosition(tiers, posFromIndex(tiers, 75))).toBe("Mythic ★25");
  });
});

describe("starOptionCount", () => {
  it("puncak hanya untuk sisi tujuan di divisi terakhir", () => {
    expect(starOptionCount(tiers, { tier: 2, division: 0 }, true)).toBe(26);
    expect(starOptionCount(tiers, { tier: 2, division: 0 }, false)).toBe(25);
    expect(starOptionCount(tiers, { tier: 0, division: 4 }, true)).toBe(5);
  });
});
