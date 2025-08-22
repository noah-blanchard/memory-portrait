// src/theme.ts
import { createTheme, getThemeColor, rem } from '@mantine/core';
import type {
  ButtonProps,
  MantineColor,
  MantineTheme,
  MantineThemeColors,
  MantineThemeOverride,
} from '@mantine/core';

export const theme: MantineThemeOverride = createTheme({
  // ---------- Couleurs ----------
  colors: {
    babyBlue: [
      '#f5faff',
      '#e9f4ff',
      '#d3e9ff',
      '#b8dcff',
      '#94cbff',
      '#6cb6ff',
      '#46a2ff',
      '#2a8ce6',
      '#1e6fba',
      '#145089',
    ],
    sunnyYellow: [
      '#fffbea',
      '#fff3c2',
      '#ffe79a',
      '#ffd86e',
      '#ffc53d',
      '#ffb300',
      '#ff9b00',
      '#e07f00',
      '#b86100',
      '#8a4b00',
    ],
    mist: [
      '#f8fafc',
      '#f1f5f9',
      '#e2e8f0',
      '#cbd5e1',
      '#94a3b8',
      '#64748b',
      '#475569',
      '#334155',
      '#1e293b',
      '#0f172a',
    ],
  },

  // ---------- Réglages globaux ----------
  primaryColor: 'babyBlue',
  primaryShade: 6,
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol',
  defaultRadius: 'lg',
  cursorType: 'pointer',

  // ---------- Typo ----------
  headings: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans',
    sizes: {
      h1: { fontSize: rem(36), fontWeight: '800', lineHeight: '1.15' },
      h2: { fontSize: rem(28), fontWeight: '700', lineHeight: '1.2' },
      h3: { fontSize: rem(22), fontWeight: '700', lineHeight: '1.25' },
    },
  },

  // ---------- Spacing / Shadows ----------
  spacing: {
    xs: rem(6),
    sm: rem(10),
    md: rem(14),
    lg: rem(20),
    xl: rem(28),
  },
  shadows: {
    xs: '0 1px 2px rgba(0,0,0,0.05)',
    sm: '0 2px 6px rgba(0,0,0,0.06)',
    md: '0 6px 16px rgba(0,0,0,0.08)',
    lg: '0 12px 24px rgba(0,0,0,0.12)',
    xl: '0 20px 40px rgba(0,0,0,0.16)',
  },

  // ---------- Composants ----------
  components: {
    Button: {
      defaultProps: {
        size: 'md',
        radius: 'lg',
        variant: 'filled',
        color: 'babyBlue',
      },
      styles: (
        theme: MantineTheme,
        params: { variant?: ButtonProps['variant']; color?: MantineColor }
      ) => ({
        root: {
          fontWeight: 700,
          boxShadow: params.variant === 'filled' ? theme.shadows.sm : 'none',
          transition: 'transform 120ms ease, box-shadow 120ms ease',
          '&:active': { transform: 'translateY(1px)' },
        },
      }),
    },

    Badge: {
      defaultProps: { radius: 'sm', variant: 'light', color: 'babyBlue' },
    },

    Card: {
      defaultProps: { radius: 'xl', padding: 'lg', withBorder: true },
      styles: (theme: MantineTheme) => ({
        root: {
          backgroundColor: theme.colors.mist[0],
          borderColor: theme.colors.mist[2],
          boxShadow: theme.shadows.xs,
        },
      }),
    },

    TextInput: {
      defaultProps: { radius: 'md' },
      styles: (theme: MantineTheme) => ({
        input: {
          backgroundColor: '#fff',
          borderColor: theme.colors.mist[3],
          '&:focus, &:focus-within': {
            borderColor: theme.colors.babyBlue[6],
            boxShadow: `0 0 0 3px ${theme.colors.babyBlue[1]}`,
          },
        },
        label: { fontWeight: 600 },
      }),
    },

    Textarea: {
      defaultProps: { radius: 'md', autosize: true, minRows: 3 },
      styles: (theme: MantineTheme) => ({
        input: {
          backgroundColor: '#fff',
          borderColor: theme.colors.mist[3],
          '&:focus, &:focus-within': {
            borderColor: theme.colors.babyBlue[6],
            boxShadow: `0 0 0 3px ${theme.colors.babyBlue[1]}`,
          },
        },
        label: { fontWeight: 600 },
      }),
    },

    Select: {
      defaultProps: { radius: 'md', checkIconPosition: 'right' },
      styles: (theme: MantineTheme) => ({
        input: {
          backgroundColor: '#fff',
          borderColor: theme.colors.mist[3],
          '&:focus, &:focus-within': {
            borderColor: theme.colors.babyBlue[6],
            boxShadow: `0 0 0 3px ${theme.colors.babyBlue[1]}`,
          },
        },
        label: { fontWeight: 600 },
      }),
    },

    Checkbox: {
      defaultProps: { radius: 'sm', color: 'babyBlue' },
      styles: (theme: MantineTheme) => ({
        input: {
          '&:focus-visible': {
            outline: `3px solid ${theme.colors.babyBlue[1]}`,
          },
        },
        label: { fontWeight: 600 },
      }),
    },

    Switch: {
      defaultProps: { color: 'babyBlue' },
    },

    Modal: {
      defaultProps: { radius: 'lg', centered: true, overlayProps: { blur: 4 } },
      styles: (theme: MantineTheme) => ({
        header: { borderBottom: `1px solid ${theme.colors.mist[2]}` },
        body: { paddingTop: theme.spacing.md },
      }),
    },

    Loader: {
      defaultProps: { type: 'oval', color: 'babyBlue' },
    },

    Tooltip: {
      defaultProps: { color: 'dark', radius: 'md', withArrow: true, arrowSize: 8 },
    },

    Notification: {
      defaultProps: { radius: 'lg', color: 'babyBlue' },
      styles: (theme: MantineTheme, params: { color?: MantineColor }) => {
        const colorName = params.color ?? 'babyBlue'; // <-- bien typé (string des keys de theme.colors)
        const isSecondary = colorName === 'sunnyYellow';

        return {
          root: {
            border: '1px solid',
            // soit on spécial-case sunnyYellow…
            borderColor: isSecondary
              ? getThemeColor('sunnyYellow.3', theme)
              : getThemeColor('babyBlue.2', theme),
            boxShadow: theme.shadows.sm,
          },
        };
      },
    },
  },

  // ---------- Accents ----------
  focusRing: 'auto',
  defaultGradient: {
    from: 'babyBlue.6',
    to: 'sunnyYellow.4',
    deg: 45,
  },
});
