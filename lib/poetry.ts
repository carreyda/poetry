import { notFound } from "next/navigation";
import { sampleWorks } from "./sample-works";
import {
  hasSupabaseAdminConfig,
  hasSupabaseReadConfig,
  insertWork,
  patchWork,
  selectAdminWorks,
  selectWorks,
} from "./supabase/server";
import type { PoetryWork, PoetryWorkInput } from "./types";

const columns =
  "id,slug,title,author,dynasty,genre,content,notes,appreciation,tags,featured,published,created_at,updated_at";

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function publicSampleWorks() {
  return sampleWorks.filter((work) => work.published);
}

function byNewest(a: PoetryWork, b: PoetryWork) {
  return Date.parse(b.created_at ?? "") - Date.parse(a.created_at ?? "");
}

export async function getPublishedWorks() {
  if (!hasSupabaseReadConfig()) {
    return publicSampleWorks().sort(byNewest);
  }

  return selectWorks({
    select: columns,
    published: "eq.true",
    order: "created_at.desc",
  });
}

export async function getFeaturedWorks() {
  if (!hasSupabaseReadConfig()) {
    return publicSampleWorks().filter((work) => work.featured);
  }

  return selectWorks({
    select: columns,
    published: "eq.true",
    featured: "eq.true",
    order: "created_at.desc",
  });
}

export async function getRecentWorks(limit = 6) {
  const works = await getPublishedWorks();
  return works.slice(0, limit);
}

export async function getWorkBySlug(slug: string) {
  if (!hasSupabaseReadConfig()) {
    return publicSampleWorks().find((work) => work.slug === slug) ?? null;
  }

  const rows = await selectWorks({
    select: columns,
    slug: `eq.${slug}`,
    published: "eq.true",
    limit: "1",
  });

  return rows[0] ?? null;
}

export async function getWorkBySlugOrNotFound(slug: string) {
  const work = await getWorkBySlug(slug);
  if (!work) {
    notFound();
  }

  return work;
}

export async function getAdminWorks() {
  if (!hasSupabaseAdminConfig()) {
    return sampleWorks.sort(byNewest);
  }

  return selectAdminWorks({
    select: columns,
    order: "created_at.desc",
  });
}

export async function getAdminWorkById(id: string) {
  if (!hasSupabaseAdminConfig()) {
    return sampleWorks.find((work) => work.id === id) ?? null;
  }

  const rows = await selectAdminWorks({
    select: columns,
    id: `eq.${id}`,
    limit: "1",
  });

  return rows[0] ?? null;
}

export async function createWork(input: PoetryWorkInput) {
  if (!hasSupabaseAdminConfig()) {
    throw new Error("请先配置 Supabase 后台环境变量。");
  }

  return insertWork(input);
}

export async function updateWork(id: string, input: Partial<PoetryWorkInput>) {
  if (!hasSupabaseAdminConfig()) {
    throw new Error("请先配置 Supabase 后台环境变量。");
  }

  return patchWork(id, input);
}

export function getWorkStats(works: PoetryWork[]) {
  return {
    dynasties: Array.from(new Set(works.map((work) => work.dynasty).filter(Boolean))),
    genres: Array.from(new Set(works.map((work) => work.genre).filter(Boolean))),
    authors: Array.from(new Set(works.map((work) => work.author).filter(Boolean))),
  };
}
