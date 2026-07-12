export function br(s: string | number | null | undefined): number {
  if (typeof s === 'number') return s;
  return parseFloat((s || '').toString().replace(/\./g, '').replace(',', '.')) || 0;
}

export function fmt(v: number | null | undefined): string {
  return (
    'R$ ' +
    parseFloat((v || 0).toString())
      .toFixed(2)
      .replace('.', ',')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  );
}

export function fq(v: number | null | undefined, t: string | null | undefined): string {
  return parseFloat((v || 0).toString()).toFixed(0) + (t === 'ml' ? ' ml' : ' un');
}

export function tod(): string {
  return new Date().toISOString().split('T')[0];
}

export function fd(d: string | null | undefined): string {
  if (!d) return '—';
  const p = d.split('-');
  return p[2] + '/' + p[1] + '/' + p[0];
}
