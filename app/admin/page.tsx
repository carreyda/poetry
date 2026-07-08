import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { loginAction } from "./actions";

export const metadata: Metadata = {
  title: "后台登录",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdminAuthenticated()) {
    redirect("/admin/works");
  }

  const { error } = await searchParams;

  return (
    <main className="admin-page">
      <section className="admin-panel login-panel">
        <p className="eyebrow">古韵诗词后台</p>
        <h1>录入入口</h1>
        <p className="admin-muted">请输入环境变量中配置的后台密码。</p>
        {error ? <p className="danger-note">密码不正确，或后台密码尚未配置。</p> : null}
        <form action={loginAction} className="form-grid">
          <label className="full">
            后台密码
            <input name="password" type="password" autoComplete="current-password" required />
          </label>
          <div className="form-actions full">
            <button className="text-button" type="submit">
              进入后台
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
