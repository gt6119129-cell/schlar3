export type ThemePaletteId =
  | 'palette_1'
  | 'palette_2'
  | 'palette_3'
  | 'palette_4'
  | 'palette_5'
  | 'palette_6'
  | 'palette_7'
  | 'palette_8'
  | 'palette_9'
  | 'palette_10'
  | 'palette_11'
  | 'palette_12'
  | 'custom';

export interface CoreColorTokens {
  primary: string;     // Primary brand color
  secondary: string;   // Secondary brand color
  accent: string;      // Accent / highlight color
  background: string;  // Main page background
  surface: string;     // Card / container surface
}

export interface ThemePalette {
  id: ThemePaletteId;
  name: string;
  paletteNumber: number;
  isDefault?: boolean;
  colors: CoreColorTokens;
  description: string;
}

export interface CustomThemeRecord {
  id: string;
  name: string;
  colors: CoreColorTokens;
  createdAt: string;
  updatedAt: string;
}

export interface ThemeExportSchema {
  version: '1.0';
  schlarTheme: true;
  name: string;
  colors: CoreColorTokens;
  exportedAt: string;
}
