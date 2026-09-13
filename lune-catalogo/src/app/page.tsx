import CatalogoClient from './CatalogoClient';

export const revalidate = 60;

interface Perfume {
  id: number;
  nome: string;
  marca: string | null;
  genero: 'feminino' | 'masculino' | 'compartilhavel';
  preco: number;
}

async function getPerfumes(): Promise<Perfume[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const res = await fetch(`${url}/rest/v1/perfumes?select=id,nome,marca,genero,preco&order=nome.asc`, {
    headers: { apikey: key!, Authorization: `Bearer ${key}` },
    next: { revalidate },
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function Home() {
  const perfumes = await getPerfumes();
  return <CatalogoClient perfumes={perfumes} />;
}
