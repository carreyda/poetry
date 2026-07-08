import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedWorks, getWorkStats } from "@/lib/poetry";

export const metadata: Metadata = {
  title: "诗卷",
  description: "浏览古韵诗词中收录的诗词歌赋。",
};

export default async function WorksPage() {
  const works = await getPublishedWorks();
  const stats = getWorkStats(works);

  return (
    <main className="site-shell">
      <section className="works-header">
        <p className="eyebrow">诗卷总览</p>
        <h1>所有收录</h1>
        <p className="hero-copy">
          这里收着已发布的诗词歌赋。先按作品铺开，保留朝代、体裁、作者与标签，适合慢慢翻阅。
        </p>
      </section>

      <section className="taxonomy-grid">
        <SummaryCard label="作品" value={`${works.length} 篇`} />
        <SummaryCard label="朝代" value={`${stats.dynasties.length || 1} 类`} />
        <SummaryCard label="作者" value={`${stats.authors.length || 1} 位`} />
      </section>

      <section className="works-page">
        <div className="works-list">
          {works.map((work) => (
            <article className="work-row" key={work.id}>
              <div>
                <p className="work-meta">
                  {work.dynasty ?? "未署朝代"} · {work.author}
                  {work.genre ? ` · ${work.genre}` : ""}
                </p>
                <h2>{work.title}</h2>
                {work.tags?.length ? (
                  <div className="tag-list">
                    {work.tags.map((tag) => (
                      <span className="tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              <Link className="text-link" href={`/works/${work.slug}`}>
                阅读
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="taxonomy-card">
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  );
}
