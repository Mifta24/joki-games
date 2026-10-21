import { Link } from "react-router";

export function meta() {
  return [{ title: "Halaman tidak ditemukan" }, { name: "robots", content: "noindex" }];
}

export default function NotFound() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-24 text-center">
      <h1 className="text-5xl font-extrabold">404</h1>
      <p className="mt-3 text-muted">Halaman yang kamu cari tidak ada.</p>
      <Link to="/" className="mt-6 inline-block rounded-xl bg-brand px-5 py-3 font-semibold">
        Kembali ke beranda
      </Link>
    </div>
  );
}
