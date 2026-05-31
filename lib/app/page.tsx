import Image from "next/image";
import Link from "next/link";
import { getFeaturedWorks, getRecentWorks, getWorkStats } from "@/lib/poetry";

export default async function Home() {
  const [featuredWorks, recentWorks] = await Promise.all([
    getFeaturedWorks(),
    getRecentWorks(5),
  ]);
  const stats = getWorkStats(recentWorks);
  const heroWork = featuredWorks[0] ?? recentWorks[0];

  return (
    <main>
      <section className="hero-section">
        <Image
          src="/poetry-hero.png"
          alt=""
          fill
          priority
          className="hero-image"
          sizes="100vw"
        />
        <div className="hero-overlay" />
        <div className="site-shell hero-content">
          <p className="eyebrow">诗词歌赋 · 私藏选本</p>
          <h1>把一卷清词，安放在今日的屏幕上。</h1>
          <p className="hero-copy">
            收集古典诗、词、曲与歌赋，保留原文的清气，也为每一篇留下可慢读的注释与赏析。
          </p>
          <div className="hero-actions">
            <Link className="primary-link" href="/works">
              浏览诗卷
            </Link>
            <Link className="secondary-link" href="/admin">
              后台录入
            </Link>
          </div>
        </div>
      </section>

      {heroWork ? (
        <section className="site-shell feature-band">
          <div>
            <p className="eyebrow">今日展卷</p>
            <h2>{heroWork.title}</h2>
            <p className="muted">
              {heroWork.dynasty} · {heroWork.author}
              {heroWork.genre ? ` · ${heroWork.genre}` : ""}
            </p>
          </div>
          <blockquote className="poem-lines">
            {heroWork.content.split("\n").map((line) => (
              <span key={line}>{line}</span>
            ))}
          </blockquote>
          <Link className="text-link" href={`/works/${heroWork.slug}`}>
            细读此篇
          </Link>
        </section>
      ) : null}

      <section className="site-shell index-grid">
        <div className="section-heading">
          <p className="eyebrow">分类入口</p>
          <h2>从时代、体裁与作者进入</h2>
        </div>
        <div className="taxonomy-grid">
          <Taxonomy title="朝代" items={stats.dynasties} fallback="唐、宋、元、明、清" />
          <Taxonomy title="体裁" items={stats.genres} fallback="诗、词、曲、赋" />
          <Taxonomy title="作者" items={stats.authors.slice(0, 6)} fallback="李白、杜甫、苏轼" />
        </div>
      </section>

      <section className="site-shell recent-section">
        <div className="section-heading horizontal">
          <div>
            <p className="eyebrow">近期收录</p>
            <h2>新入卷册</h2>
          </div>
          <Link className="text-link" href="/works">
            查看全部
          </Link>
        </div>
        <div className="work-card-grid">
          {recentWorks.map((work) => (
            <Link className="work-card" href={`/works/${work.slug}`} key={work.id}>
              <p className="work-meta">
                {work.dynasty ?? "未署朝代"} · {work.genre ?? "诗词"}
              </p>
              <h3>{work.title}</h3>
              <p>{work.author}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function Taxonomy({
  title,
  items,
  fallback,
}: {
  title: string;
  items: (string | null)[];
  fallback: string;
}) {
  const text = items.filter(Boolean).join("、") || fallback;

  return (
    <article className="taxonomy-card">
      <p>{title}</p>
      <strong>{text}</strong>
    </article>
  );
}
