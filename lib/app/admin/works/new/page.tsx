import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { createWorkAction } from "../../actions";
import { WorkForm } from "../work-form";

export const metadata: Metadata = {
  title: "新增作品",
};

export default async function NewWorkPage() {
  await requireAdmin();

  return (
    <main className="site-shell admin-page">
      <section className="works-header">
        <Link className="text-link" href="/admin/works">
          返回管理
        </Link>
        <p className="eyebrow">后台</p>
        <h1>新增作品</h1>
      </section>
      <WorkForm action={createWorkAction} />
    </main>
  );
}
