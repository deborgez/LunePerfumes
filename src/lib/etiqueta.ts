// Gera a etiqueta de um frasco (14mm x 40mm) como PNG, renderizada em canvas.
const DPI = 300;
const MM_TO_PX = (mm: number) => Math.round((mm / 25.4) * DPI);

const LARGURA_MM = 40;
const ALTURA_MM = 14;

function ajustarFonte(ctx: CanvasRenderingContext2D, texto: string, larguraMax: number, fontePadrao: number, familia: string): number {
  let tamanho = fontePadrao;
  ctx.font = `${tamanho}px ${familia}`;
  while (ctx.measureText(texto).width > larguraMax && tamanho > 6) {
    tamanho -= 1;
    ctx.font = `${tamanho}px ${familia}`;
  }
  return tamanho;
}

export function gerarEtiquetaPng(clienteNome: string, perfumeNome: string): Promise<Blob> {
  const w = MM_TO_PX(LARGURA_MM);
  const h = MM_TO_PX(ALTURA_MM);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const padX = Math.round(w * 0.05);
  const larguraMax = w - padX * 2;
  const familia = 'Arial, sans-serif';

  const linha1 = 'Produzido e envazado especialmente para';
  const linha2 = clienteNome.trim() || 'Cliente';
  const linha3 = `Inspirado ${perfumeNome}`.trim();

  const f1 = ajustarFonte(ctx, linha1, larguraMax, Math.round(h * 0.16), familia);
  const f2 = ajustarFonte(ctx, linha2, larguraMax, Math.round(h * 0.22), familia);
  const f3 = ajustarFonte(ctx, linha3, larguraMax, Math.round(h * 0.16), familia);

  const yCentro = h / 2;
  const espacamento = h * 0.28;

  ctx.font = `${f1}px ${familia}`;
  ctx.fillText(linha1, w / 2, yCentro - espacamento, larguraMax);

  ctx.font = `bold ${f2}px ${familia}`;
  ctx.fillText(linha2, w / 2, yCentro, larguraMax);

  ctx.font = `${f3}px ${familia}`;
  ctx.fillText(linha3, w / 2, yCentro + espacamento, larguraMax);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Falha ao gerar imagem da etiqueta'));
    }, 'image/png');
  });
}

export async function baixarEtiqueta(clienteNome: string, perfumeNome: string): Promise<void> {
  const blob = await gerarEtiquetaPng(clienteNome, perfumeNome);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const nomeArquivo = `etiqueta-${perfumeNome}-${clienteNome || 'cliente'}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  a.download = `${nomeArquivo}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
