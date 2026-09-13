// Gera a etiqueta de um frasco (14mm x 40mm) como PNG, renderizada em canvas.
const DPI = 300;
const MM_TO_PX = (mm: number) => Math.round((mm / 25.4) * DPI);

const LARGURA_MM = 40;
const ALTURA_MM = 14;

const FONTE = 'Playfair Display';
const FONTE_FALLBACK = `"${FONTE}", Georgia, serif`;

async function garantirFonteCarregada(): Promise<void> {
  try {
    await Promise.all([
      document.fonts.load(`400 16px "${FONTE}"`),
      document.fonts.load(`600 16px "${FONTE}"`),
      document.fonts.load(`italic 500 16px "${FONTE}"`),
    ]);
    await document.fonts.ready;
  } catch {
    // segue com a fonte de fallback caso a web font não carregue
  }
}

function ajustarFonte(ctx: CanvasRenderingContext2D, texto: string, larguraMax: number, fontePadrao: number, prefixo: string): number {
  let tamanho = fontePadrao;
  ctx.font = `${prefixo} ${tamanho}px ${FONTE_FALLBACK}`;
  while (ctx.measureText(texto).width > larguraMax && tamanho > 6) {
    tamanho -= 1;
    ctx.font = `${prefixo} ${tamanho}px ${FONTE_FALLBACK}`;
  }
  return tamanho;
}

export async function gerarEtiquetaPng(clienteNome: string, perfumeNome: string): Promise<Blob> {
  await garantirFonteCarregada();

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

  const linha1 = 'Produzido e envazado especialmente para';
  const linha2 = clienteNome.trim() || 'Cliente';
  const linha3 = 'Fragrância inspirada em';
  const linha4 = perfumeNome.trim();

  const f1 = ajustarFonte(ctx, linha1, larguraMax, Math.round(h * 0.135), '');
  const f2 = ajustarFonte(ctx, linha2, larguraMax, Math.round(h * 0.19), '600');
  const f3 = ajustarFonte(ctx, linha3, larguraMax, Math.round(h * 0.135), '');
  const f4 = ajustarFonte(ctx, linha4, larguraMax, Math.round(h * 0.16), 'italic 500');

  const y1 = h * 0.15;
  const y2 = h * 0.38;
  const y3 = h * 0.62;
  const y4 = h * 0.85;

  ctx.font = `${f1}px ${FONTE_FALLBACK}`;
  ctx.fillText(linha1, w / 2, y1, larguraMax);

  ctx.font = `600 ${f2}px ${FONTE_FALLBACK}`;
  ctx.fillText(linha2, w / 2, y2, larguraMax);

  ctx.font = `${f3}px ${FONTE_FALLBACK}`;
  ctx.fillText(linha3, w / 2, y3, larguraMax);

  ctx.font = `italic 500 ${f4}px ${FONTE_FALLBACK}`;
  ctx.fillText(linha4, w / 2, y4, larguraMax);

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
