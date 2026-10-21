import type { Service } from "~/lib/schema";
import { formatRupiah } from "~/lib/format";

export function PriceTable({ service }: { service: Service }) {
  if (service.type === "rank") {
    return (
      <div className="overflow-hidden rounded-xl border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg text-muted">
            <tr>
              <th className="px-4 py-2 font-medium">Tier</th>
              <th className="px-4 py-2 font-medium">Bintang</th>
              <th className="px-4 py-2 text-right font-medium">Harga / bintang</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {service.tiers.map((t) => (
              <tr key={t.name}>
                <td className="px-4 py-2">{t.name}</td>
                <td className="px-4 py-2 text-muted">{t.divisions.length * t.starsPerDivision}</td>
                <td className="px-4 py-2 text-right font-semibold">{formatRupiah(t.pricePerStar)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (service.type === "per_unit") {
    return (
      <p className="text-sm text-muted">
        <span className="text-lg font-semibold text-white">{formatRupiah(service.price)}</span> per {service.unit}
        {service.min > 1 && <> · minimal {service.min} {service.unit}</>}
      </p>
    );
  }
  return (
    <p className="text-lg font-semibold">{formatRupiah(service.price)}</p>
  );
}
