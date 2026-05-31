import type { PoetryWork, PoetryWorkInput } from "../types";

type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE";

const tableName = "poetry_works";

function getSupabaseConfig(useServiceRole = false) {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const key = useServiceRole ? serviceRoleKey : anonKey;

  if (!url || !key) {
    return null;
  }

  return {
    url: url.replace(/\/$/, ""),
    key,
  };
}

export function hasSupabaseReadConfig() {
  return Boolean(getSupabaseConfig(false));
}

export function hasSupabaseAdminConfig() {
  return Boolean(getSupabaseConfig(true));
}

function buildUrl(path: string, params?: Record<string, string>) {
  const config = getSupabaseConfig(path.startsWith("admin:"));
  if (!config) {
    throw new Error("Supabase is not configured.");
  }

  const cleanPath = path.replace(/^admin:/, "");
  const url = new URL(`${config.url}/rest/v1/${cleanPath}`);
  Object.entries(params ?? {}).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  return { url, key: config.key };
}

async function request<T>(
  method: RequestMethod,
  path: string,
  params?: Record<string, string>,
  body?: unknown,
) {
  const { url, key } = buildUrl(path, params);
  const response = await fetch(url, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Supabase request failed with ${response.status}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

export async function selectWorks(params: Record<string, string>) {
  return request<PoetryWork[]>("GET", tableName, params);
}

export async function selectAdminWorks(params: Record<string, string>) {
  return request<PoetryWork[]>("GET", `admin:${tableName}`, params);
}

export async function insertWork(input: PoetryWorkInput) {
  const rows = await request<PoetryWork[]>("POST", `admin:${tableName}`, undefined, input);
  return rows[0];
}

export async function patchWork(id: string, input: Partial<PoetryWorkInput>) {
  const rows = await request<PoetryWork[]>(
    "PATCH",
    `admin:${tableName}`,
    { id: `eq.${id}` },
    input,
  );
  return rows[0];
}
