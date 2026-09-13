// Gera a etiqueta de um frasco (14mm x 40mm) como PNG, renderizada em canvas.
// Usa a fonte real Panton (arquivos em /public/fonts), carregada sob demanda.
const DPI = 300;
const MM_TO_PX = (mm: number) => Math.round((mm / 25.4) * DPI);

const LARGURA_MM = 40;
const ALTURA_MM = 14;

// Tamanho de fonte de referência do Photoshop (4,24 pt) convertido para px
// na mesma resolução (300dpi) usada para gerar o canvas em alta definição.
const TAMANHO_FONTE_PT = 4.24;
const TAMANHO_FONTE_PX = (TAMANHO_FONTE_PT / 72) * DPI;

const FONTE = 'Panton';
const FONTE_FALLBACK = `"${FONTE}", "Helvetica Neue", Arial, sans-serif`;

let fontesCarregadas: Promise<void> | null = null;

function garantirFonteCarregada(): Promise<void> {
  if (!fontesCarregadas) {
    fontesCarregadas = (async () => {
      try {
        const [light, bold] = await Promise.all([
          new FontFace(FONTE, 'url(/fonts/Panton-LightItalic.ttf)', { style: 'italic', weight: '300' }).load(),
          new FontFace(FONTE, 'url(/fonts/Panton-Bold.ttf)', { style: 'normal', weight: '700' }).load(),
        ]);
        document.fonts.add(light);
        document.fonts.add(bold);
      } catch {
        // segue com a fonte de fallback caso o arquivo não carregue
      }
    })();
  }
  return fontesCarregadas;
}

const BG_URL = '/etiqueta-bg-lune.png';
let bgCarregado: Promise<HTMLImageElement | null> | null = null;

function carregarImagemFundo(): Promise<HTMLImageElement | null> {
  if (!bgCarregado) {
    bgCarregado = new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = BG_URL;
    });
  }
  return bgCarregado;
}

// A fonte Panton (versão trial) não tem os glifos acentuados do português —
// letras como "â"/"ç"/"ã" saem como caractere quebrado. Removemos os acentos
// do texto renderizado para evitar isso.
function semAcentos(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '');
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
  const [, bg] = await Promise.all([garantirFonteCarregada(), carregarImagemFundo()]);

  const w = MM_TO_PX(LARGURA_MM);
  const h = MM_TO_PX(ALTURA_MM);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);
  if (bg) ctx.drawImage(bg, 0, 0, w, h);
  ctx.fillStyle = '#000000';
  ctx.textBaseline = 'middle';

  const padEsq = Math.round(w * 0.045);
  const padDir = Math.round(w * 0.04);
  const larguraLogo = w * 0.19;
  const larguraTexto = w - padEsq - padDir - larguraLogo;

  const linha1 = 'Produzido e envazado especialmente para';
  const linha2 = semAcentos(clienteNome.trim() || 'Cliente');
  const linha3 = semAcentos('Fragrância inspirada em');
  const linha4 = semAcentos(perfumeNome.trim().toUpperCase());

  ctx.textAlign = 'left';

  const f1 = ajustarFonte(ctx, linha1, larguraTexto, TAMANHO_FONTE_PX, 'italic 300');
  const f2 = ajustarFonte(ctx, linha2, larguraTexto, TAMANHO_FONTE_PX, '700');
  const f3 = ajustarFonte(ctx, linha3, larguraTexto, TAMANHO_FONTE_PX, 'italic 300');
  const f4 = ajustarFonte(ctx, linha4, larguraTexto, TAMANHO_FONTE_PX, '700');

  const y1 = h * 0.22;
  const y2 = h * 0.36;
  const y3 = h * 0.64;
  const y4 = h * 0.78;

  ctx.font = `italic 300 ${f1}px ${FONTE_FALLBACK}`;
  ctx.fillText(linha1, padEsq, y1, larguraTexto);

  ctx.font = `700 ${f2}px ${FONTE_FALLBACK}`;
  ctx.fillText(linha2, padEsq, y2, larguraTexto);

  ctx.font = `italic 300 ${f3}px ${FONTE_FALLBACK}`;
  ctx.fillText(linha3, padEsq, y3, larguraTexto);

  ctx.font = `700 ${f4}px ${FONTE_FALLBACK}`;
  ctx.fillText(linha4, padEsq, y4, larguraTexto);

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
