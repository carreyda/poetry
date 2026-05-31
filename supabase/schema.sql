create extension if not exists "pgcrypto";

create table if not exists public.poetry_works (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  author text not null,
  dynasty text,
  genre text,
  content text not null,
  notes text,
  appreciation text,
  tags text[] default '{}',
  featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists poetry_works_published_created_idx
  on public.poetry_works (published, created_at desc);

create index if not exists poetry_works_featured_idx
  on public.poetry_works (featured)
  where featured = true;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_poetry_works_updated_at on public.poetry_works;

create trigger set_poetry_works_updated_at
before update on public.poetry_works
for each row
execute function public.set_updated_at();

alter table public.poetry_works enable row level security;

drop policy if exists "Published poetry works are readable" on public.poetry_works;

create policy "Published poetry works are readable"
on public.poetry_works
for select
using (published = true);
