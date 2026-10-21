import { useState } from "react";
import { formatRupiah } from "~/lib/format";
import {
  calcRankPrice,
  calcUnitPrice,
  describePosition,
  positionIndex,
  posFromIndex,
  starOptionCount,
  totalStars,
  type TierPos,
} from "~/lib/pricing";
import type { Game, RankService, Service } from "~/lib/schema";
import { buildWaLink } from "~/lib/whatsapp";

type RankState = { from: TierPos; to: TierPos };
type States = Record<string, RankState | string>;

function initialState(service: Service): RankState | string {
  if (service.type === "rank") {
    const total = totalStars(service.tiers);
    return {
      from: posFromIndex(service.tiers, Math.min(12, total - 1)),
      to: posFromIndex(service.tiers, Math.min(25, total)),
    };
  }
  if (service.type === "per_unit") return String(service.min);
  return "";
}

type Summary = { detail: string; price: number; valid: boolean; error: string; eta: string; lines: string[] };

function summarize(game: Game, service: Service, state: RankState | string): Summary {
  const eta = service.eta ? `${service.eta}*` : "Konfirmasi admin";
  const base = [`Game: ${game.name}`, `Layanan: ${service.name}`];

  if (service.type === "rank") {
    const s = state as RankState;
    const a = positionIndex(service.tiers, s.from);
    const b = positionIndex(service.tiers, s.to);
    const detail = `${describePosition(service.tiers, s.from)} → ${describePosition(service.tiers, s.to)}`;
    if (b <= a) {
      return { detail, price: 0, valid: false, eta, error: "Pilih rank tujuan yang lebih tinggi dari posisi awal.", lines: [] };
    }
    const price = calcRankPrice(service.tiers, a, b);
    return { detail, price, valid: true, error: "", eta, lines: [...base, `Detail: ${detail}`, `Estimasi: ${formatRupiah(price)}`] };
  }

  if (service.type === "per_unit") {
    const raw = state as string;
    const n = Number(raw);
    const detail = `${raw || "—"} ${service.unit}`;
    if (raw === "" || !Number.isInteger(n) || n < service.min || n > 999) {
      return { detail, price: 0, valid: false, eta, error: `Masukkan jumlah bulat ${service.min}–999 ${service.unit}.`, lines: [] };
    }
    const price = calcUnitPrice(service.price, n, service.min);
    return { detail, price, valid: true, error: "", eta, lines: [...base, `Detail: ${detail}`, `Estimasi: ${formatRupiah(price)}`] };
  }

  return {
    detail: "Paket harga tetap",
    price: service.price,
    valid: true,
    error: "",
    eta,
    lines: [...base, `Estimasi: ${formatRupiah(service.price)}`],
  };
}

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

function PositionPicker({
  label,
  tiers,
  value,
  onChange,
  isTarget,
  idPrefix,
}: {
  label: string;
  tiers: RankService["tiers"];
  value: TierPos;
  onChange: (p: TierPos) => void;
  isTarget: boolean;
  idPrefix: string;
}) {
  const tier = tiers[value.tier];
  const stars = starOptionCount(tiers, value, isTarget);

  const changeTier = (ti: number) => {
    const t = tiers[ti];
    const division = Math.min(value.division, t.divisions.length - 1);
    const star = Math.min(value.star, starOptionCount(tiers, { tier: ti, division }, isTarget) - 1);
    onChange({ tier: ti, division, star });
  };
  const changeDivision = (division: number) => {
    const star = Math.min(value.star, starOptionCount(tiers, { tier: value.tier, division }, isTarget) - 1);
    onChange({ tier: value.tier, division, star });
  };

  return (
    <div>
      <span className="column-label">{label}</span>
      <div className="field-stack">
        <label>
          Rank
          <select id={`${idPrefix}-tier`} value={value.tier} onChange={(e) => changeTier(Number(e.target.value))}>
            {tiers.map((t, i) => (
              <option key={t.name} value={i}>{t.name}</option>
            ))}
          </select>
        </label>
        <label>
          Divisi
          <select id={`${idPrefix}-division`} value={value.division} onChange={(e) => changeDivision(Number(e.target.value))}>
            {tier.divisions.map((d, i) => (
              <option key={d + i} value={i}>{d === "-" ? "—" : d}</option>
            ))}
          </select>
        </label>
        <label>
          {isTarget ? "Bintang tujuan" : "Bintang saat ini"}
          <select id={`${idPrefix}-star`} value={value.star} onChange={(e) => onChange({ ...value, star: Number(e.target.value) })}>
            {range(stars).map((i) => (
              <option key={i} value={i}>★ {i}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

function tierNote(service: Service): string {
  if (service.type === "rank") {
    const rates = service.tiers.map((t) => `${t.name} ${formatRupiah(t.pricePerStar)}/bintang`).join(" · ");
    return `Tarif: ${rates}.${service.eta ? ` Estimasi pengerjaan ${service.eta}.` : ""}`;
  }
  if (service.type === "per_unit") {
    return `Harga ${formatRupiah(service.price)}/${service.unit} · minimal ${service.min} ${service.unit}.`;
  }
  return `Harga paket ${formatRupiah(service.price)}. Konfirmasi cakupan paket ke admin sebelum membayar.`;
}

export function GameCalculator({ game, phone }: { game: Game; phone: string }) {
  const [activeId, setActiveId] = useState(game.services[0].id);
  const [states, setStates] = useState<States>(() =>
    Object.fromEntries(game.services.map((s) => [s.id, initialState(s)])),
  );

  const idx = Math.max(0, game.services.findIndex((s) => s.id === activeId));
  const service = game.services[idx];
  const state = states[service.id];
  const summary = summarize(game, service, state);
  const set = (v: RankState | string) => setStates((prev) => ({ ...prev, [service.id]: v }));

  const monogram = game.name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const n = game.services.length;
    const next = (i + (e.key === "ArrowRight" ? 1 : n - 1)) % n;
    setActiveId(game.services[next].id);
    document.getElementById(`tab-${game.services[next].id}`)?.focus();
  };

  return (
    <div className="calc-grid">
      <div className="config">
        <div className="calc-top">
          <span className="game-monogram" aria-hidden="true">{monogram}</span>
          <div>
            <strong>{game.name}</strong>
            <small>Pilih layanan untuk melihat estimasi</small>
          </div>
        </div>

        <div className="service-tabs" role="tablist" aria-label="Jenis layanan">
          {game.services.map((s, i) => (
            <button
              key={s.id}
              id={`tab-${s.id}`}
              type="button"
              role="tab"
              aria-selected={s.id === service.id}
              aria-controls={`pane-${s.id}`}
              tabIndex={s.id === service.id ? 0 : -1}
              onClick={() => setActiveId(s.id)}
              onKeyDown={(e) => onTabKey(e, i)}
            >
              {s.name}
            </button>
          ))}
        </div>

        <div id={`pane-${service.id}`} className="service-pane" role="tabpanel" aria-labelledby={`tab-${service.id}`}>
          {service.type === "rank" && (
            <>
              <p className="pane-desc">
                Tentukan posisi sekarang dan tujuan. Estimasi menjumlah harga setiap bintang yang perlu dilalui.
              </p>
              <div className="selectors">
                <PositionPicker
                  label="Dari posisi"
                  idPrefix="from"
                  tiers={service.tiers}
                  value={(state as RankState).from}
                  isTarget={false}
                  onChange={(from) => set({ ...(state as RankState), from })}
                />
                <PositionPicker
                  label="Ke tujuan"
                  idPrefix="to"
                  tiers={service.tiers}
                  value={(state as RankState).to}
                  isTarget
                  onChange={(to) => set({ ...(state as RankState), to })}
                />
              </div>
            </>
          )}
          {service.type === "per_unit" && (
            <>
              <p className="pane-desc">
                {service.name} dihitung per {service.unit}. Minimal order {service.min} {service.unit}.
              </p>
              <div className="field-stack quantity">
                <label>
                  Jumlah {service.unit}
                  <input
                    type="number"
                    inputMode="numeric"
                    min={service.min}
                    max={999}
                    step={1}
                    value={state as string}
                    onChange={(e) => set(e.target.value)}
                  />
                </label>
              </div>
            </>
          )}
          {service.type === "package" && (
            <p className="pane-desc">
              {service.name} memiliki harga tetap. Detail cakupan dan ketentuan paket dikonfirmasi admin sebelum pembayaran.
            </p>
          )}
          <div className="tier-note">{tierNote(service)}</div>
        </div>
        <div className="calc-error" role="status" aria-live="polite">{summary.error}</div>
      </div>

      <aside className="receipt" aria-label="Ringkasan estimasi">
        <span className="receipt-kicker">Ringkasan pilihanmu</span>
        <h3>Siap dibawa<br />ke chat.</h3>
        <dl>
          <div><dt>Game</dt><dd>{game.name}</dd></div>
          <div><dt>Layanan</dt><dd>{service.name}</dd></div>
          <div><dt>Detail</dt><dd>{summary.detail}</dd></div>
          <div><dt>Estimasi waktu</dt><dd>{summary.eta}</dd></div>
        </dl>
        <div className="total-label">ESTIMASI HARGA</div>
        <div className="total" aria-live="polite">{summary.valid ? formatRupiah(summary.price) : "—"}</div>
        <p className="subtle">*Waktu dan harga final dikonfirmasi admin di chat.</p>
        {summary.valid ? (
          <a className="order-button" href={buildWaLink(phone, summary.lines)} target="_blank" rel="noopener noreferrer">
            Order via WhatsApp ↗
          </a>
        ) : (
          <button type="button" className="order-button" disabled>Order via WhatsApp ↗</button>
        )}
        <div className="demo-alert">
          Tidak ada form login akun atau pembayaran di website ini. Jangan bagikan kredensial di sini; data akun hanya lewat chat admin.
        </div>
      </aside>
    </div>
  );
}
