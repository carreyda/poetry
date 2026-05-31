import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminWorks } from "@/lib/poetry";
import { logoutAction, togglePublishedAction } from "../actions";

export const metadata: Metadata = {
  title: "作品管理",
};

export default async function AdminWorksPage() {
  await requireAdmin();
  const works = await getAdminWorks();

  return (
    <main className="site-shell admin-page">
      <nav className="admin-nav">
        <Link className="text-link" href="/">
          清辞集
        </Link>
        <form action={logoutAction}>
          <button className="secondary-link" type="submit">
            退出
          </button>
        </form>
      </nav>

      <section className="admin-heading works-header">
        <div>
          <p className="eyebrow">后台</p>
          <h1>作品管理</h1>
          <p className="admin-muted">管理已收录的诗词歌赋，新增、编辑或切换发布状态。</p>
        </div>
        <Link className="primary-link" href="/admin/works/new">
          新增作品
        </Link>
      </section>

      <section className="admin-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>标题</th>
              <th>作者</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {works.map((work) => (
              <tr key={work.id}>
                <td>{work.title}</td>
                <td>
                  {work.dynasty ?? "未署"} · {work.author}
                </td>
                <td>{work.published ? "已发布" : "草稿"}</td>
                <td>
                  <div className="admin-actions">
                    <Link className="text-link" href={`/admin/works/${work.id}/edit`}>
                      编辑
                    </Link>
                    <form action={togglePublishedAction.bind(null, work.id, !work.published)}>
                      <button className="secondary-link" type="submit">
                        {work.published ? "设为草稿" : "发布"}
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
