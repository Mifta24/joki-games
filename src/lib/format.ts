export function formatRupiah(n: number): string {
  return `Rp ${Math.round(n).toLocaleString("id-ID")}`;
}
