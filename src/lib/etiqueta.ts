// Gera a etiqueta de um frasco (14mm x 40mm) como PNG, renderizada em canvas.
// Fonte de referência do modelo é Panton (Light Italic / Bold); como o Panton
// não é uma fonte gratuita disponível via Google Fonts, usamos Poppins como
// substituta visualmente equivalente (geométrica, mesma família de estilo).
const DPI = 300;
const MM_TO_PX = (mm: number) => Math.round((mm / 25.4) * DPI);

const LARGURA_MM = 40;
const ALTURA_MM = 14;

const FONTE = 'Poppins';
const FONTE_FALLBACK = `"${FONTE}", "Helvetica Neue", Arial, sans-serif`;

async function garantirFonteCarregada(): Promise<void> {
  try {
    await Promise.all([
      document.fonts.load(`italic 300 16px "${FONTE}"`),
      document.fonts.load(`700 16px "${FONTE}"`),
      document.fonts.load(`600 16px "${FONTE}"`),
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
  ctx.textBaseline = 'middle';

  const padEsq = Math.round(w * 0.045);
  const padDir = Math.round(w * 0.04);
  const larguraLogo = w * 0.19;
  const larguraTexto = w - padEsq - padDir - larguraLogo;

  const linha1 = 'Produzido e envazado especialmente para';
  const linha2 = clienteNome.trim() || 'Cliente';
  const linha3 = 'Fragrância inspirada em';
  const linha4 = perfumeNome.trim().toUpperCase();

  ctx.textAlign = 'left';

  const f1 = ajustarFonte(ctx, linha1, larguraTexto, Math.round(h * 0.115), 'italic 300');
  const f2 = ajustarFonte(ctx, linha2, larguraTexto, Math.round(h * 0.15), '700');
  const f3 = ajustarFonte(ctx, linha3, larguraTexto, Math.round(h * 0.115), 'italic 300');
  const f4 = ajustarFonte(ctx, linha4, larguraTexto, Math.round(h * 0.15), '700');

  const y1 = h * 0.22;
  const y2 = h * 0.36;
  const y3 = h * 0.65;
  const y4 = h * 0.79;

  ctx.font = `italic 300 ${f1}px ${FONTE_FALLBACK}`;
  ctx.fillText(linha1, padEsq, y1, larguraTexto);

  ctx.font = `700 ${f2}px ${FONTE_FALLBACK}`;
  ctx.fillText(linha2, padEsq, y2, larguraTexto);

  ctx.font = `italic 300 ${f3}px ${FONTE_FALLBACK}`;
  ctx.fillText(linha3, padEsq, y3, larguraTexto);

  ctx.font = `700 ${f4}px ${FONTE_FALLBACK}`;
  ctx.fillText(linha4, padEsq, y4, larguraTexto);

  // Logo fixa "LUNE" (LU / NE empilhado), alinhada à direita.
  ctx.textAlign = 'right';
  const xLogo = w - padDir;
  const fLogo = Math.round(h * 0.32);
  ctx.font = `600 ${fLogo}px ${FONTE_FALLBACK}`;
  ctx.fillText('LU', xLogo, h * 0.36);
  ctx.fillText('NE', xLogo, h * 0.68);

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
