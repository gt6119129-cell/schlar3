import { CoreColorTokens } from '../theme/types';
import { SCHLAR_PALETTES, DEFAULT_PALETTE, getPaletteById, getContrastTextColor } from '../theme/palettes';
import { getStoredActiveColors } from '../theme/themeEngine';

export interface ThemeClasses {
  primaryBg: string;
  primaryHoverBg: string;
  lightBg: string;
  borderColor: string;
  textColor: string;
  focusRing: string;
  badgeBg: string;
  activeNav: string;
  hex: string;
  secondaryHex: string;
  accentHex: string;
  backgroundHex: string;
  surfaceHex: string;
  primaryContrastText: string;
}

// Map legacy theme identifiers to palette IDs
const LEGACY_MAP: Record<string, string> = {
  emerald: 'palette_10',
  slate: 'palette_6',
  indigo: 'palette_8',
  amber: 'palette_7',
  rose: 'palette_3',
  navy: 'palette_1',
  petrol: 'palette_7'
};

export const getThemeClasses = (themeId?: string): ThemeClasses => {
  const activeColors: CoreColorTokens = getStoredActiveColors();
  const effectiveId = (themeId && LEGACY_MAP[themeId]) ? LEGACY_MAP[themeId] : (themeId || DEFAULT_PALETTE.id);
  const palette = getPaletteById(effectiveId);
  const colors = (effectiveId === palette.id) ? palette.colors : activeColors;

  const contrastText = getContrastTextColor(colors.primary);

  return {
    primaryBg: 'bg-[var(--color-primary)]',
    primaryHoverBg: 'hover:opacity-90',
    lightBg: 'bg-[var(--color-background)]',
    borderColor: 'border-slate-200',
    textColor: 'text-[var(--color-primary)]',
    focusRing: 'focus:ring-2 focus:ring-[var(--color-secondary)]',
    badgeBg: 'bg-slate-100 text-slate-800 border-slate-200',
    activeNav: 'bg-[var(--color-primary)] text-white shadow-xs',
    hex: colors.primary,
    secondaryHex: colors.secondary,
    accentHex: colors.accent,
    backgroundHex: colors.background,
    surfaceHex: colors.surface,
    primaryContrastText: contrastText
  };
};
