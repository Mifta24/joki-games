import { Button } from "~/components/ui";

export function meta() {
  return [{ title: "Halaman tidak ditemukan" }, { name: "robots", content: "noindex" }];
}

export default function NotFound() {
  return (
    <div className="wrap notfound">
      <h1>404</h1>
      <p style={{ color: "var(--sub)", marginBottom: 24 }}>Halaman yang kamu cari tidak ada.</p>
      <Button to="/">Kembali ke beranda</Button>
    </div>
  );
}
