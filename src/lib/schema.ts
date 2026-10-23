import { z } from "zod";

export const Tier = z.object({
  name: z.string().min(1),
  divisions: z.array(z.string()).min(1),
  starsPerDivision: z.number().int().positive(),
  pricePerStar: z.number().int().nonnegative(),
});

export const Service = z.discriminatedUnion("type", [
  z.object({
    id: z.string(),
    type: z.literal("rank"),
    name: z.string(),
    eta: z.string().optional(),
    tiers: z.array(Tier).min(1),
  }),
  z.object({
    id: z.string(),
    type: z.literal("per_unit"),
    name: z.string(),
    unit: z.string(),
    price: z.number().int().nonnegative(),
    min: z.number().int().positive().default(1),
    eta: z.string().optional(),
  }),
  // Harga per unit (mis. per win) yang berbeda tiap pilihan (mis. tiap rank).
  z.object({
    id: z.string(),
    type: z.literal("tiered_unit"),
    name: z.string(),
    unit: z.string(),
    options: z.array(z.object({ name: z.string().min(1), price: z.number().int().nonnegative() })).min(1),
    min: z.number().int().positive().default(1),
    eta: z.string().optional(),
  }),
  z.object({
    id: z.string(),
    type: z.literal("package"),
    name: z.string(),
    price: z.number().int().nonnegative(),
    eta: z.string().optional(),
  }),
]);

export const Game = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  cover: z.string().optional(),
  active: z.boolean(),
  services: z.array(Service).min(1),
});

export const Site = z.object({
  brand: z.string(),
  url: z.string().url(),
  whatsapp: z.string().regex(/^\d{8,15}$/, "Nomor WA harus angka, format internasional tanpa +"),
  hours: z.string(),
  /** Nama metode bayar untuk ringkasan (footer, FAQ). */
  payment: z.array(z.string()).min(1),
  /** Rekening / e-wallet yang ditampilkan di halaman cara order. */
  accounts: z.array(z.object({ method: z.string(), number: z.string(), holder: z.string() })).default([]),
  /** Link pembayaran / donasi online. */
  paymentLinks: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
  /** Akun sosmed resmi (semua cabang), tampil di footer. */
  socials: z.array(z.object({ platform: z.string(), label: z.string(), url: z.string().url() })).default([]),
  testimonialUrl: z.string().url().optional(),
});

export const Testimonial = z.object({
  name: z.string(),
  game: z.string(),
  text: z.string().optional(),
  image: z.string().optional(),
});

export const FaqItem = z.object({ q: z.string(), a: z.string() });

export type Tier = z.infer<typeof Tier>;
export type Game = z.infer<typeof Game>;
export type Service = z.infer<typeof Service>;
export type RankService = Extract<Service, { type: "rank" }>;
export type TieredUnitService = Extract<Service, { type: "tiered_unit" }>;
export type Site = z.infer<typeof Site>;
export type Testimonial = z.infer<typeof Testimonial>;
export type FaqItem = z.infer<typeof FaqItem>;
