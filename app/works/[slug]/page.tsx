import type { Metadata } from "next";
import Link from "next/link";
import { getWorkBySlug, getWorkBySlugOrNotFound } from "@/lib/poetry";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);

  if (!work) {
    return {
      title: "未找到作品",
    };
  }

  return {
    title: work.title,
    description: `${work.author}《${work.title}》`,
  };
}

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const work = await getWorkBySlugOrNotFound(slug);

  return (
    <main className="site-shell work-detail">
      <Link className="text-link" href="/works">
        返回诗卷
      </Link>

      <section className="detail-hero">
        <p className="eyebrow">
          {work.dynasty ?? "未署朝代"} · {work.author}
          {work.genre ? ` · ${work.genre}` : ""}
        </p>
        <h1>{work.title}</h1>
        {work.tags?.length ? (
          <div className="tag-list">
            {work.tags.map((tag) => (
              <span className="tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </section>

      <section className="detail-layout">
        <blockquote className="detail-poem poem-lines">
          {work.content.split("\n").map((line) => (
            <span key={line}>{line}</span>
          ))}
        </blockquote>

        <article className="article-body">
          {work.notes ? (
            <>
              <h2>注释</h2>
              <p>{work.notes}</p>
            </>
          ) : null}
          {work.appreciation ? (
            <>
              <h2>赏析</h2>
              <p>{work.appreciation}</p>
            </>
          ) : null}
        </article>
      </section>
    </main>
  );
}
