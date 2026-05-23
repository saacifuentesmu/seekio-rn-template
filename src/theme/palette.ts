export type ColorScheme = 'light' | 'dark';
export type PaletteName = 'default' | 'forest' | 'slate';

export interface PaletteColors {
  primary: string;
  primaryDark: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  error: string;
  success: string;
  warning: string;
}

export const palettes: Record<PaletteName, Record<ColorScheme, PaletteColors>> = {
  default: {
    light: {
      primary: '#2563EB',
      primaryDark: '#1E40AF',
      secondary: '#64748B',
      background: '#FFFFFF',
      surface: '#F8FAFC',
      text: '#0F172A',
      textMuted: '#64748B',
      border: '#E2E8F0',
      error: '#DC2626',
      success: '#16A34A',
      warning: '#D97706',
    },
    dark: {
      primary: '#60A5FA',
      primaryDark: '#3B82F6',
      secondary: '#94A3B8',
      background: '#0B1220',
      surface: '#111827',
      text: '#F1F5F9',
      textMuted: '#94A3B8',
      border: '#1F2937',
      error: '#F87171',
      success: '#4ADE80',
      warning: '#FBBF24',
    },
  },
  forest: {
    light: {
      primary: '#15803D',
      primaryDark: '#166534',
      secondary: '#6B7F6B',
      background: '#FFFFFF',
      surface: '#F1F8F2',
      text: '#0F1F12',
      textMuted: '#5B6E5E',
      border: '#D7E5D9',
      error: '#B91C1C',
      success: '#16A34A',
      warning: '#CA8A04',
    },
    dark: {
      primary: '#4ADE80',
      primaryDark: '#22C55E',
      secondary: '#86A887',
      background: '#0B130D',
      surface: '#11201A',
      text: '#ECFDF3',
      textMuted: '#9CB7A0',
      border: '#1E3026',
      error: '#F87171',
      success: '#86EFAC',
      warning: '#FACC15',
    },
  },
  slate: {
    light: {
      primary: '#475569',
      primaryDark: '#334155',
      secondary: '#94A3B8',
      background: '#FFFFFF',
      surface: '#F1F5F9',
      text: '#0F172A',
      textMuted: '#64748B',
      border: '#E2E8F0',
      error: '#B91C1C',
      success: '#15803D',
      warning: '#A16207',
    },
    dark: {
      primary: '#CBD5E1',
      primaryDark: '#94A3B8',
      secondary: '#64748B',
      background: '#0F141B',
      surface: '#1A202B',
      text: '#E2E8F0',
      textMuted: '#94A3B8',
      border: '#27303D',
      error: '#FCA5A5',
      success: '#86EFAC',
      warning: '#FCD34D',
    },
  },
};

export type Palette = PaletteColors;

export const palette: Palette = palettes.default.light;
