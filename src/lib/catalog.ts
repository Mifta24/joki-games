// Satu-satunya pintu akses data. Komponen tidak boleh import JSON langsung.
// Data di-parse dengan Zod saat modul dimuat, jadi data salah => build/prerender gagal.
import { z } from "zod";
import faqJson from "../data/faq.json";
import gamesJson from "../data/games.json";
import siteJson from "../data/site.json";
import testimonialsJson from "../data/testimonials.json";
import { FaqItem, Game, Site, Testimonial } from "./schema";

const games = z
  .array(Game)
  .superRefine((list, ctx) => {
    const seen = new Set<string>();
    list.forEach((g, i) => {
      if (seen.has(g.slug)) ctx.addIssue({ code: "custom", message: `slug dobel: ${g.slug}`, path: [i, "slug"] });
      seen.add(g.slug);
    });
  })
  .parse(gamesJson);
const site = Site.parse(siteJson);
const testimonials = z.array(Testimonial).parse(testimonialsJson);
const faq = z.array(FaqItem).parse(faqJson);

export const getSite = () => site;
export const getGames = () => games.filter((g) => g.active);
export const getGame = (slug: string) => getGames().find((g) => g.slug === slug);
export const getTestimonials = () => testimonials;
export const getFaq = () => faq;

/** Harga terendah yang ditampilkan di kartu game ("mulai dari"). */
export function getStartingPrice(game: Game): number {
  const prices = game.services.map((s) => {
    if (s.type === "rank") return Math.min(...s.tiers.map((t) => t.pricePerStar));
    if (s.type === "tiered_unit") return Math.min(...s.options.map((o) => o.price));
    return s.price;
  });
  return Math.min(...prices);
}
