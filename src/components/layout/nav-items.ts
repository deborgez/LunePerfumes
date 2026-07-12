import {
  IconLayoutDashboard,
  IconFlask,
  IconBox,
  IconDroplet,
  IconShoppingCart,
  IconCash,
} from '@tabler/icons-react';

export const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', mobileLabel: 'Início', icon: IconLayoutDashboard },
  { href: '/essencias', label: 'Essências', mobileLabel: 'Essências', icon: IconFlask },
  { href: '/insumos', label: 'Insumos', mobileLabel: 'Insumos', icon: IconBox },
  { href: '/perfumes', label: 'Perfumes', mobileLabel: 'Perfumes', icon: IconDroplet },
  { href: '/vendas', label: 'Vendas', mobileLabel: 'Vendas', icon: IconShoppingCart },
  { href: '/caixa', label: 'Caixa', mobileLabel: 'Caixa', icon: IconCash },
] as const;

export const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/essencias': 'Essências',
  '/insumos': 'Insumos',
  '/perfumes': 'Perfumes',
  '/vendas': 'Vendas',
  '/caixa': 'Caixa',
};
