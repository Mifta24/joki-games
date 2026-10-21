import { data } from "react-router";
import { GameCalculator } from "~/components/game/GameCalculator";
import { Steps } from "~/components/ui";
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
    <>
      <section className="calculator" id="kalkulator">
        <div className="wrap">
          <div className="calc-intro" style={{ marginBottom: 18 }}>
            <h1>Joki {game.name}.<br />Hitung dulu.</h1>
            <p>Pilih layanan dan posisi; ringkasan mengikuti pilihanmu secara langsung. Harga final dikonfirmasi admin di chat.</p>
          </div>
          <GameCalculator game={game} phone={whatsapp} />
        </div>
      </section>
      <Steps />
    </>
  );
}
