import type { Config } from "@react-router/dev/config";
import { getGames } from "./src/lib/catalog";

export default {
  appDirectory: "src",
  ssr: false,
  // Semua route di-prerender jadi HTML statis. Halaman game dibuat otomatis dari games.json.
  async prerender() {
    return [
      "/",
      "/cara-order",
      "/syarat-ketentuan",
      ...getGames().map((g) => `/joki/${g.slug}`),
    ];
  },
} satisfies Config;
