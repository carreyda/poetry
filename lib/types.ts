export type PoetryWork = {
  id: string;
  slug: string;
  title: string;
  author: string;
  dynasty: string | null;
  genre: string | null;
  content: string;
  notes: string | null;
  appreciation: string | null;
  tags: string[] | null;
  featured: boolean;
  published: boolean;
  created_at: string | null;
  updated_at: string | null;
};

export type PoetryWorkInput = {
  slug: string;
  title: string;
  author: string;
  dynasty: string | null;
  genre: string | null;
  content: string;
  notes: string | null;
  appreciation: string | null;
  tags: string[];
  featured: boolean;
  published: boolean;
};
