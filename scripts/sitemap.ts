// Dijalankan setelah build: membuat build/client/sitemap.xml dari games.json.
import { writeFileSync } from "node:fs";
import { getGames, getSite } from "../src/lib/catalog";

const { url } = getSite();
const paths = ["/", "/cara-order", "/syarat-ketentuan", ...getGames().map((g) => `/joki/${g.slug}`)];
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${url}${p}</loc></url>`).join("\n")}
</urlset>
`;
writeFileSync("build/client/sitemap.xml", xml);
console.log(`sitemap.xml: ${paths.length} URL`);
