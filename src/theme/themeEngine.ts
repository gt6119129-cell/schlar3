import { CoreColorTokens, CustomThemeRecord, ThemeExportSchema } from './types';
import { DEFAULT_PALETTE, SCHLAR_PALETTES, hexToRgb, isValidHexColor } from './palettes';

const ACTIVE_PALETTE_ID_KEY = 'schlar_active_palette_id';
const ACTIVE_CUSTOM_COLORS_KEY = 'schlar_active_custom_colors';
const SAVED_CUSTOM_THEMES_KEY = 'schlar_saved_custom_themes';

export function applyThemeToDom(colors: CoreColorTokens): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const primaryRgb = hexToRgb(colors.primary);
  const secondaryRgb = hexToRgb(colors.secondary);
  const accentRgb = hexToRgb(colors.accent);
  const surfaceRgb = hexToRgb(colors.surface);
  const backgroundRgb = hexToRgb(colors.background);

  // Set centralized CSS variables
  root.style.setProperty('--color-primary', colors.primary);
  root.style.setProperty('--color-primary-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
  root.style.setProperty('--color-secondary', colors.secondary);
  root.style.setProperty('--color-secondary-rgb', `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`);
  root.style.setProperty('--color-accent', colors.accent);
  root.style.setProperty('--color-accent-rgb', `${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}`);
  root.style.setProperty('--color-background', colors.background);
  root.style.setProperty('--color-background-rgb', `${backgroundRgb.r}, ${backgroundRgb.g}, ${backgroundRgb.b}`);
  root.style.setProperty('--color-surface', colors.surface);
  root.style.setProperty('--color-surface-rgb', `${surfaceRgb.r}, ${surfaceRgb.g}, ${surfaceRgb.b}`);

  // Legacy compatibility mappings
  root.style.setProperty('--primary-accent', colors.primary);
  root.style.setProperty('--primary-accent-hover', colors.secondary);
  root.style.setProperty('--primary-accent-light', colors.background);
  root.style.setProperty('--primary-accent-border', `${colors.secondary}40`);

  // Synchronize body background
  if (document.body) {
    document.body.style.backgroundColor = colors.background;
  }
}

export function getStoredActivePaletteId(): string {
  try {
    return localStorage.getItem(ACTIVE_PALETTE_ID_KEY) || DEFAULT_PALETTE.id;
  } catch {
    return DEFAULT_PALETTE.id;
  }
}

export function saveStoredActivePaletteId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_PALETTE_ID_KEY, id);
  } catch (err) {
    console.warn('Unable to persist palette ID to localStorage:', err);
  }
}

export function getStoredActiveColors(): CoreColorTokens {
  try {
    const raw = localStorage.getItem(ACTIVE_CUSTOM_COLORS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (validateCoreColors(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading stored theme colors:', err);
  }
  return DEFAULT_PALETTE.colors;
}

export function saveStoredActiveColors(colors: CoreColorTokens): void {
  try {
    localStorage.setItem(ACTIVE_CUSTOM_COLORS_KEY, JSON.stringify(colors));
  } catch (err) {
    console.warn('Unable to persist theme colors to localStorage:', err);
  }
}

export function getStoredCustomThemes(): CustomThemeRecord[] {
  try {
    const raw = localStorage.getItem(SAVED_CUSTOM_THEMES_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        return list.filter(item => item && item.id && item.name && validateCoreColors(item.colors));
      }
    }
  } catch (err) {
    console.warn('Error reading saved custom themes:', err);
  }
  return [];
}

export function saveStoredCustomThemes(themes: CustomThemeRecord[]): void {
  try {
    localStorage.setItem(SAVED_CUSTOM_THEMES_KEY, JSON.stringify(themes));
  } catch (err) {
    console.warn('Unable to persist custom themes to localStorage:', err);
  }
}

export function validateCoreColors(obj: unknown): obj is CoreColorTokens {
  if (!obj || typeof obj !== 'object') return false;
  const c = obj as Record<string, unknown>;
  return (
    typeof c.primary === 'string' && isValidHexColor(c.primary) &&
    typeof c.secondary === 'string' && isValidHexColor(c.secondary) &&
    typeof c.accent === 'string' && isValidHexColor(c.accent) &&
    typeof c.background === 'string' && isValidHexColor(c.background) &&
    typeof c.surface === 'string' && isValidHexColor(c.surface)
  );
}

export function exportThemeToJSON(name: string, colors: CoreColorTokens): string {
  const schema: ThemeExportSchema = {
    version: '1.0',
    schlarTheme: true,
    name: name.trim() || 'Custom SCHLAR Theme',
    colors,
    exportedAt: new Date().toISOString()
  };
  return JSON.stringify(schema, null, 2);
}

export function importThemeFromJSON(jsonString: string): { success: boolean; name?: string; colors?: CoreColorTokens; error?: string } {
  try {
    if (!jsonString || typeof jsonString !== 'string') {
      return { success: false, error: 'Empty or invalid input provided.' };
    }

    const parsed = JSON.parse(jsonString.trim());
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'JSON payload is not an object.' };
    }

    // Support both full schema and simple color object
    let colorsCandidate: unknown = parsed.colors;
    let nameCandidate = typeof parsed.name === 'string' ? parsed.name : 'Imported Theme';

    if (!colorsCandidate && validateCoreColors(parsed)) {
      colorsCandidate = parsed;
    }

    if (!validateCoreColors(colorsCandidate)) {
      return {
        success: false,
        error: 'Invalid colors payload. Must contain valid 6-digit hex values for primary, secondary, accent, background, and surface.'
      };
    }

    return {
      success: true,
      name: nameCandidate,
      colors: colorsCandidate
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to parse JSON string.'
    };
  }
}
