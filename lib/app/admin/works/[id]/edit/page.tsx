import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminWorkById } from "@/lib/poetry";
import { updateWorkAction } from "../../../actions";
import { WorkForm } from "../../work-form";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "编辑作品",
};

export default async function EditWorkPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  const work = await getAdminWorkById(id);

  if (!work) {
    notFound();
  }

  return (
    <main className="site-shell admin-page">
      <section className="works-header">
        <Link className="text-link" href="/admin/works">
          返回管理
        </Link>
        <p className="eyebrow">后台</p>
        <h1>编辑作品</h1>
      </section>
      <WorkForm work={work} action={updateWorkAction.bind(null, work.id)} />
    </main>
  );
}
