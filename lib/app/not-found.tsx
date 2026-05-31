import Link from "next/link";

export default function NotFound() {
  return (
    <main className="site-shell works-header">
      <p className="eyebrow">未见此卷</p>
      <h1>没有找到这篇作品</h1>
      <p className="hero-copy">它也许尚未发布，或已经换了新的别名。</p>
      <Link className="primary-link" href="/works">
        回到诗卷
      </Link>
    </main>
  );
}
