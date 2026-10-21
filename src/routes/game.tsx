import { data } from "react-router";
import { ServiceTabs } from "~/components/game/ServiceTabs";
import { getGame, getSite } from "~/lib/catalog";
import type { Route } from "./+types/game";

export function loader({ params }: Route.LoaderArgs) {
  const game = getGame(params.slug);
  if (!game) throw data("Game tidak ditemukan", { status: 404 });
  return { game, whatsapp: getSite().whatsapp };
}

export function meta({ loaderData: d }: Route.MetaArgs) {
  if (!d) return [{ title: "Game tidak ditemukan" }];
  const { brand, url } = getSite();
  const title = `Joki ${d.game.name} Murah & Aman | ${brand}`;
  const description = `Price list dan kalkulator harga joki ${d.game.name}. Order lewat WhatsApp, harga transparan.`;
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: `${url}/og/${d.game.slug}.png` },
    { property: "og:type", content: "website" },
  ];
}

export default function GamePage({ loaderData }: Route.ComponentProps) {
  const { game, whatsapp } = loaderData;
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-extrabold">Joki {game.name}</h1>
      <p className="mt-2 text-muted">Pilih layanan, hitung estimasi, lalu order lewat WhatsApp.</p>
      <div className="mt-8">
        <ServiceTabs game={game} phone={whatsapp} />
      </div>
      <p className="mt-8 text-xs text-muted">
        Harga di atas adalah estimasi. Harga final dikonfirmasi admin di chat. Joki dapat melanggar ketentuan layanan game, baca Syarat &amp; Ketentuan.
      </p>
    </div>
  );
}
