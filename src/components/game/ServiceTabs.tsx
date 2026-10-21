import { useState } from "react";
import { Badge, Card } from "~/components/ui";
import type { Game } from "~/lib/schema";
import { PriceCalculator } from "./PriceCalculator";
import { PriceTable } from "./PriceTable";

export function ServiceTabs({ game, phone }: { game: Game; phone: string }) {
  const [active, setActive] = useState(game.services[0].id);
  const service = game.services.find((s) => s.id === active) ?? game.services[0];

  return (
    <div>
      <div role="tablist" className="flex flex-wrap gap-2">
        {game.services.map((s) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={s.id === service.id}
            onClick={() => setActive(s.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              s.id === service.id ? "bg-brand text-white" : "border border-line text-muted hover:text-white"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold">{service.name}</h3>
            {service.eta && <Badge>Estimasi {service.eta}</Badge>}
          </div>
          <PriceTable service={service} />
        </Card>
        <Card>
          <h3 className="mb-4 text-lg font-bold">Hitung &amp; order</h3>
          {/* key memaksa state kalkulator reset saat ganti layanan */}
          <PriceCalculator key={service.id} gameName={game.name} service={service} phone={phone} />
        </Card>
      </div>
    </div>
  );
}
