"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearAdminSession, createAdminSession, requireAdmin } from "@/lib/admin-auth";
import { createWork, slugify, updateWork } from "@/lib/poetry";
import type { PoetryWorkInput } from "@/lib/types";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getLongText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getOptional(formData: FormData, key: string) {
  const value = getString(formData, key);
  return value.length > 0 ? value : null;
}

function parseTags(value: string) {
  return value
    .split(/[，,\n]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function parseWorkInput(formData: FormData): PoetryWorkInput {
  const title = getString(formData, "title");
  const author = getString(formData, "author");
  const slug = getString(formData, "slug") || slugify(`${title}-${author}`);

  if (!title || !author || !slug || !getLongText(formData, "content")) {
    throw new Error("标题、作者、别名和正文不能为空。");
  }

  return {
    title,
    author,
    slug,
    dynasty: getOptional(formData, "dynasty"),
    genre: getOptional(formData, "genre"),
    content: getLongText(formData, "content"),
    notes: getOptional(formData, "notes"),
    appreciation: getOptional(formData, "appreciation"),
    tags: parseTags(getString(formData, "tags")),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
  };
}

export async function loginAction(formData: FormData) {
  const password = getString(formData, "password");

  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    redirect("/admin?error=1");
  }

  await createAdminSession();
  redirect("/admin/works");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin");
}

export async function createWorkAction(formData: FormData) {
  await requireAdmin();
  const work = await createWork(parseWorkInput(formData));
  revalidatePath("/");
  revalidatePath("/works");
  redirect(`/admin/works/${work.id}/edit`);
}

export async function updateWorkAction(id: string, formData: FormData) {
  await requireAdmin();
  await updateWork(id, parseWorkInput(formData));
  revalidatePath("/");
  revalidatePath("/works");
  redirect("/admin/works");
}

export async function togglePublishedAction(id: string, published: boolean) {
  await requireAdmin();
  await updateWork(id, { published });
  revalidatePath("/");
  revalidatePath("/works");
  redirect("/admin/works");
}
