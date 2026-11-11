import { ThemePalette, CoreColorTokens } from './types';

export const SCHLAR_PALETTES: ThemePalette[] = [
  {
    id: 'palette_1',
    name: 'Navy & Teal',
    paletteNumber: 1,
    description: 'Executive navy with refreshing coastal teal and warm gold highlights.',
    colors: {
      primary: '#17324D',
      secondary: '#2A7886',
      accent: '#E0A458',
      background: '#F2F5F8',
      surface: '#FFFFFF'
    }
  },
  {
    id: 'palette_2',
    name: 'Forest & Champagne',
    paletteNumber: 2,
    description: 'Deep botanical evergreen with balanced sage and champagne amber accents.',
    colors: {
      primary: '#245747',
      secondary: '#54866A',
      accent: '#D6B878',
      background: '#F3F4EC',
      surface: '#FFFFFF'
    }
  },
  {
    id: 'palette_3',
    name: 'Oxblood & Blush',
    paletteNumber: 3,
    description: 'Rich academic oxblood wine accented with rosewood and delicate blush.',
    colors: {
      primary: '#702D3A',
      secondary: '#A65C69',
      accent: '#D9A3A7',
      background: '#F8F0F0',
      surface: '#FFFFFF'
    }
  },
  {
    id: 'palette_4',
    name: 'Cobalt & Electric Lime',
    paletteNumber: 4,
    description: 'High-contrast technological cobalt with dynamic electric lime energy.',
    colors: {
      primary: '#2448A5',
      secondary: '#3C70D6',
      accent: '#C4E83A',
      background: '#F2F5FC',
      surface: '#FFFFFF'
    }
  },
  {
    id: 'palette_5',
    name: 'Terracotta & Sage',
    paletteNumber: 5,
    description: 'Earthy Mediterranean terracotta paired with soothing herbal sage and clay.',
    colors: {
      primary: '#A34F38',
      secondary: '#71866B',
      accent: '#D9A66F',
      background: '#F7F1E9',
      surface: '#FFFFFF'
    }
  },
  {
    id: 'palette_6',
    name: 'Graphite & Ice Lavender',
    paletteNumber: 6,
    description: 'Architectural slate graphite with cool steel lavender and lilac highlights.',
    colors: {
      primary: '#343640',
      secondary: '#666A7D',
      accent: '#B8B5E8',
      background: '#F3F3F8',
      surface: '#FFFFFF'
    }
  },
  {
    id: 'palette_7',
    name: 'Petrol & Copper',
    paletteNumber: 7,
    isDefault: true,
    description: 'The authoritative SCHLAR flagship theme: deep sea petrol with aged copper bronze.',
    colors: {
      primary: '#164E55',
      secondary: '#287B7A',
      accent: '#C47D54',
      background: '#F5F0E7',
      surface: '#FFFFFF'
    }
  },
  {
    id: 'palette_8',
    name: 'Indigo & Marigold',
    paletteNumber: 8,
    description: 'Scholastic royal indigo paired with bright sunny marigold saffron.',
    colors: {
      primary: '#373B83',
      secondary: '#6266B5',
      accent: '#E9B949',
      background: '#F4F3FA',
      surface: '#FFFFFF'
    }
  },
  {
    id: 'palette_9',
    name: 'Royal Purple & Gold',
    paletteNumber: 9,
    description: 'Noble imperial amethyst purple with regal gilded brass accents.',
    colors: {
      primary: '#512B81',
      secondary: '#8056A8',
      accent: '#D8B45A',
      background: '#F6F1FA',
      surface: '#FFFFFF'
    }
  },
  {
    id: 'palette_10',
    name: 'Emerald & Coral',
    paletteNumber: 10,
    description: 'Crisp institutional jade emerald balanced by vibrant living coral warmth.',
    colors: {
      primary: '#146B58',
      secondary: '#329780',
      accent: '#EF806F',
      background: '#EFF6F2',
      surface: '#FFFFFF'
    }
  },
  {
    id: 'palette_11',
    name: 'Black & Gold',
    paletteNumber: 11,
    description: 'Distinguished formal carbon onyx illuminated with gilded bullion gold.',
    colors: {
      primary: '#242424',
      secondary: '#454545',
      accent: '#C9A44C',
      background: '#F4F2EC',
      surface: '#FFFFFF'
    }
  },
  {
    id: 'palette_12',
    name: 'Sky & Midnight',
    paletteNumber: 12,
    description: 'Deep maritime midnight blue with clear atmospheric sky and warm sunset amber.',
    colors: {
      primary: '#17365D',
      secondary: '#3985B8',
      accent: '#F0B44D',
      background: '#EFF5FA',
      surface: '#FFFFFF'
    }
  }
];

export const DEFAULT_PALETTE = SCHLAR_PALETTES.find(p => p.isDefault) || SCHLAR_PALETTES[6];

export function getPaletteById(id: string): ThemePalette {
  return SCHLAR_PALETTES.find(p => p.id === id) || DEFAULT_PALETTE;
}

export function isValidHexColor(hex: string): boolean {
  return /^#([A-Fa-f0-9]{6})$/.test(hex.trim());
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.trim().replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

export function getContrastTextColor(hexBg: string): string {
  try {
    const { r, g, b } = hexToRgb(hexBg);
    // Relative luminance
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 140 ? '#0f172a' : '#ffffff';
  } catch {
    return '#ffffff';
  }
}
