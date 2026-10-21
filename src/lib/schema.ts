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
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  hours: z.string(),
  payment: z.array(z.string()).min(1),
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
export type Site = z.infer<typeof Site>;
export type Testimonial = z.infer<typeof Testimonial>;
export type FaqItem = z.infer<typeof FaqItem>;
