import { useMemo, useState } from "react";
import { Button } from "~/components/ui";
import { formatRupiah } from "~/lib/format";
import { calcRankPrice, calcUnitPrice, listPositions } from "~/lib/pricing";
import type { Service } from "~/lib/schema";
import { buildWaLink } from "~/lib/whatsapp";

type Props = { gameName: string; service: Service; phone: string };

export function PriceCalculator({ gameName, service, phone }: Props) {
  if (service.type === "rank") return <RankCalc gameName={gameName} service={service} phone={phone} />;
  if (service.type === "per_unit") return <UnitCalc gameName={gameName} service={service} phone={phone} />;
  return (
    <div className="space-y-4">
      <Estimate value={service.price} />
      <Button
        variant="wa"
        external
        className="w-full"
        href={buildWaLink(phone, [`Game: ${gameName}`, `Layanan: ${service.name}`, `Estimasi: ${formatRupiah(service.price)}`])}
      >
        Order via WhatsApp
      </Button>
    </div>
  );
}

function Estimate({ value }: { value: number }) {
  return (
    <div className="rounded-xl bg-bg p-4">
      <p className="text-xs text-muted">Estimasi harga</p>
      <p className="text-2xl font-extrabold">{formatRupiah(value)}</p>
      <p className="mt-1 text-xs text-muted">Harga final dikonfirmasi admin di chat.</p>
    </div>
  );
}

const selectCls = "w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm";

function RankCalc({ gameName, service, phone }: Props & { service: Extract<Service, { type: "rank" }> }) {
  const positions = useMemo(() => listPositions(service.tiers), [service.tiers]);
  const last = positions.length - 1;
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(Math.min(5, last));

  const price = calcRankPrice(service.tiers, from, to);
  const valid = to > from;
  // Pilihan "dari" tidak boleh puncak (tidak ada yang bisa dinaikkan lagi).
  const fromOptions = positions.filter((p) => !p.isMax);

  const lines = [
    `Game: ${gameName}`,
    `Layanan: ${service.name}`,
    `Dari: ${positions[from].label}`,
    `Ke: ${positions[to].label}`,
    `Estimasi: ${formatRupiah(price)}`,
  ];

  return (
    <div className="space-y-4">
      <label className="block text-sm">
        <span className="mb-1 block text-muted">Rank sekarang</span>
        <select
          className={selectCls}
          value={from}
          onChange={(e) => {
            const v = Number(e.target.value);
            setFrom(v);
            if (to <= v) setTo(Math.min(v + 1, last));
          }}
        >
          {fromOptions.map((p, i) => (
            <option key={i} value={i}>{p.label}</option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-muted">Rank tujuan</span>
        <select className={selectCls} value={to} onChange={(e) => setTo(Number(e.target.value))}>
          {positions.map((p, i) => (
            <option key={i} value={i} disabled={i <= from}>{p.label}</option>
          ))}
        </select>
      </label>
      <Estimate value={valid ? price : 0} />
      {valid ? (
        <Button variant="wa" external className="w-full" href={buildWaLink(phone, lines)}>
          Order via WhatsApp
        </Button>
      ) : (
        <p className="text-sm text-amber-400">Rank tujuan harus lebih tinggi dari rank sekarang.</p>
      )}
    </div>
  );
}

function UnitCalc({ gameName, service, phone }: Props & { service: Extract<Service, { type: "per_unit" }> }) {
  const [qty, setQty] = useState(service.min);
  const price = calcUnitPrice(service.price, qty, service.min);
  const valid = price > 0;
  const lines = [
    `Game: ${gameName}`,
    `Layanan: ${service.name}`,
    `Jumlah: ${qty} ${service.unit}`,
    `Estimasi: ${formatRupiah(price)}`,
  ];
  return (
    <div className="space-y-4">
      <label className="block text-sm">
        <span className="mb-1 block text-muted">Jumlah {service.unit} (min {service.min})</span>
        <input
          type="number"
          inputMode="numeric"
          min={service.min}
          value={Number.isNaN(qty) ? "" : qty}
          onChange={(e) => setQty(e.target.value === "" ? Number.NaN : Number(e.target.value))}
          className={selectCls}
        />
      </label>
      <Estimate value={price} />
      {valid ? (
        <Button variant="wa" external className="w-full" href={buildWaLink(phone, lines)}>
          Order via WhatsApp
        </Button>
      ) : (
        <p className="text-sm text-amber-400">Minimal order {service.min} {service.unit}.</p>
      )}
    </div>
  );
}
