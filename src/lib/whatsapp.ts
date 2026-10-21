export function buildWaLink(phone: string, lines: string[] = []): string {
  const text = ["Halo, saya mau order joki:", ...lines].join("\n");
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export function buildWaContactLink(phone: string, text = "Halo, saya mau tanya soal joki."): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
