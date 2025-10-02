import {
  createTheme,
  rem,
  type ButtonProps,
  type MantineTheme,
  type MantineThemeOverride,
} from '@mantine/core';

export const theme: MantineThemeOverride = createTheme({
  colors: {
    ocean: [
      '#f0f9ff',
      '#e0f2fe',
      '#bae6fd',
      '#7dd3fc',
      '#38bdf8',
      '#0ea5e9',
      '#0284c7',
      '#0369a1',
      '#075985',
      '#0c4a6e',
    ],
    slate: [
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
    rose: [
      '#fff1f2',
      '#ffe4e6',
      '#fecdd3',
      '#fda4af',
      '#fb7185',
      '#f43f5e',
      '#e11d48',
      '#be123c',
      '#9f1239',
      '#881337',
    ],
    emerald: [
      '#ecfdf5',
      '#d1fae5',
      '#a7f3d0',
      '#6ee7b7',
      '#34d399',
      '#10b981',
      '#059669',
      '#047857',
      '#065f46',
      '#064e3b',
    ],
  },

  primaryColor: 'ocean',
  primaryShade: 5,

  fontFamily:
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',

  fontFamilyMonospace: '"JetBrains Mono", "Fira Code", Consolas, Monaco, "Courier New", monospace',

  defaultRadius: 'md',
  cursorType: 'pointer',
  respectReducedMotion: true,

  headings: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeight: '700',
    sizes: {
      h1: {
        fontSize: rem(32),
        fontWeight: '800',
        lineHeight: '1.2',
      },
      h2: {
        fontSize: rem(24),
        fontWeight: '700',
        lineHeight: '1.3',
      },
      h3: {
        fontSize: rem(20),
        fontWeight: '600',
        lineHeight: '1.4',
      },
      h4: {
        fontSize: rem(18),
        fontWeight: '600',
        lineHeight: '1.45',
      },
      h5: {
        fontSize: rem(16),
        fontWeight: '600',
        lineHeight: '1.5',
      },
      h6: {
        fontSize: rem(14),
        fontWeight: '600',
        lineHeight: '1.5',
      },
    },
  },

  spacing: {
    xs: rem(8),
    sm: rem(12),
    md: rem(16),
    lg: rem(24),
    xl: rem(32),
  },

  radius: {
    xs: rem(4),
    sm: rem(8),
    md: rem(12),
    lg: rem(16),
    xl: rem(24),
  },

  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.06), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
  },

  components: {
    Button: {
      defaultProps: {
        size: 'md',
        radius: 'lg',
      },
      styles: (_theme: MantineTheme, params: { variant?: ButtonProps['variant'] }) => ({
        root: {
          fontWeight: 600,
          letterSpacing: '0.01em',
          transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: params.variant === 'filled' ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none',

          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow:
              params.variant === 'filled'
                ? '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)'
                : 'none',
          },

          '&:active': {
            transform: 'translateY(0)',
            boxShadow: params.variant === 'filled' ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none',
          },

          '&:disabled, &[dataDisabled="true"]': {
            opacity: 0.5,
            transform: 'none',
          },
        },
      }),
    },

    Badge: {
      defaultProps: {
        radius: 'md',
        variant: 'light',
      },
      styles: () => ({
        root: {
          fontWeight: 600,
          letterSpacing: '0.01em',
          textTransform: 'none',
        },
      }),
    },

    Card: {
      defaultProps: {
        radius: 'lg',
        padding: 'lg',
        withBorder: true,
      },
      styles: (theme: MantineTheme) => ({
        root: {
          backgroundColor: theme.white,
          borderColor: theme.colors.slate[2],
          transition: 'box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)',

          '&:hover': {
            boxShadow: theme.shadows.sm,
          },
        },
      }),
    },

    TextInput: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
      styles: (theme: MantineTheme) => ({
        input: {
          backgroundColor: theme.white,
          borderColor: theme.colors.slate[3],
          fontWeight: 500,
          transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',

          '&::placeholder': {
            color: theme.colors.slate[4],
          },

          '&:focus': {
            borderColor: theme.colors.ocean[5],
            boxShadow: `0 0 0 3px ${theme.colors.ocean[0]}`,
          },

          '&[dataInvalid="true"]': {
            borderColor: theme.colors.rose[5],

            '&:focus': {
              boxShadow: `0 0 0 3px ${theme.colors.rose[1]}`,
            },
          },
        },
        label: {
          fontWeight: 600,
          fontSize: rem(14),
          marginBottom: rem(6),
          color: theme.colors.slate[7],
        },
        error: {
          fontSize: rem(13),
          fontWeight: 500,
        },
      }),
    },

    NumberInput: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
      styles: (theme: MantineTheme) => ({
        input: {
          backgroundColor: theme.white,
          borderColor: theme.colors.slate[3],
          fontWeight: 500,
          transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',

          '&:focus': {
            borderColor: theme.colors.ocean[5],
            boxShadow: `0 0 0 3px ${theme.colors.ocean[0]}`,
          },
        },
        label: {
          fontWeight: 600,
          fontSize: rem(14),
          marginBottom: rem(6),
          color: theme.colors.slate[7],
        },
      }),
    },

    PasswordInput: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
      styles: (theme: MantineTheme) => ({
        input: {
          backgroundColor: theme.white,
          borderColor: theme.colors.slate[3],
          fontWeight: 500,
          transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',

          '&:focus': {
            borderColor: theme.colors.ocean[5],
            boxShadow: `0 0 0 3px ${theme.colors.ocean[0]}`,
          },
        },
        label: {
          fontWeight: 600,
          fontSize: rem(14),
          marginBottom: rem(6),
          color: theme.colors.slate[7],
        },
      }),
    },

    NativeSelect: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
     styles: (theme: MantineTheme) => ({
        input: {
          backgroundColor: theme.white,
          borderColor: theme.colors.slate[3],
          fontWeight: 500,
          color: theme.colors.dark[7],
          transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',

          '&:focus': {
            borderColor: theme.colors.ocean[5],
            boxShadow: `0 0 0 3px ${theme.colors.ocean[0]}`,
          },

          '&:not([dataPlaceholder])': {
            color: theme.colors.dark[7],
          },
        },
        label: {
          fontWeight: 600,
          fontSize: rem(14),
          marginBottom: rem(6),
          color: theme.colors.slate[7],
        },
      }),
    },

    DatePickerInput: {
      defaultProps: {
        size: 'md',
        radius: 'md',
      },
      styles: (theme: MantineTheme) => ({
        input: {
          backgroundColor: theme.white,
          borderColor: theme.colors.slate[3],
          fontWeight: 500,
          transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',

          '&:focus': {
            borderColor: theme.colors.ocean[5],
            boxShadow: `0 0 0 3px ${theme.colors.ocean[0]}`,
          },
        },
        label: {
          fontWeight: 600,
          fontSize: rem(14),
          marginBottom: rem(6),
          color: theme.colors.slate[7],
        },
      }),
    },

    TimePicker: {
      defaultProps: {
        size: 'md',
        radius: 'md',
      },
    },

    Textarea: {
      defaultProps: {
        radius: 'md',
        autosize: true,
        minRows: 3,
      },
      styles: (theme: MantineTheme) => ({
        input: {
          backgroundColor: theme.white,
          borderColor: theme.colors.slate[3],
          fontWeight: 500,
          transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',

          '&::placeholder': {
            color: theme.colors.slate[4],
          },

          '&:focus': {
            borderColor: theme.colors.ocean[5],
            boxShadow: `0 0 0 3px ${theme.colors.ocean[0]}`,
          },
        },
        label: {
          fontWeight: 600,
          fontSize: rem(14),
          marginBottom: rem(6),
          color: theme.colors.slate[7],
        },
      }),
    },

    Select: {
      defaultProps: {
        radius: 'md',
        checkIconPosition: 'right',
      },
      styles: (theme: MantineTheme) => ({
        input: {
          backgroundColor: theme.white,
          borderColor: theme.colors.slate[3],
          fontWeight: 500,
          transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',

          '&:focus': {
            borderColor: theme.colors.ocean[5],
            boxShadow: `0 0 0 3px ${theme.colors.ocean[0]}`,
          },
        },
        label: {
          fontWeight: 600,
          fontSize: rem(14),
          marginBottom: rem(6),
          color: theme.colors.slate[7],
        },
      }),
    },

    SegmentedControl: {
      defaultProps: {
        radius: 'lg',
        size: 'md',
      },
      styles: (theme: MantineTheme) => ({
        root: {
          backgroundColor: theme.colors.slate[1],
          padding: rem(4),
        },
        control: {
          borderRadius: theme.radius.md,
        },
        label: {
          fontWeight: 600,
          fontSize: rem(14),
          padding: `${rem(8)} ${rem(12)}`,
        },
        indicator: {
          boxShadow: theme.shadows.xs,
          borderRadius: theme.radius.md,
        },
      }),
    },

    Checkbox: {
      defaultProps: {
        radius: 'sm',
      },
      styles: (theme: MantineTheme) => ({
        input: {
          borderColor: theme.colors.slate[3],
          transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',

          '&:checked': {
            borderColor: theme.colors.ocean[5],
            backgroundColor: theme.colors.ocean[5],
          },

          '&:focus-visible': {
            outline: `2px solid ${theme.colors.ocean[5]}`,
            outlineOffset: rem(2),
          },
        },
        label: {
          fontWeight: 500,
          fontSize: rem(14),
          color: theme.colors.slate[7],
        },
      }),
    },

    Switch: {
      defaultProps: {
        size: 'md',
      },
      styles: (theme: MantineTheme) => ({
        track: {
          cursor: 'pointer',
          transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
        label: {
          fontWeight: 500,
          fontSize: rem(14),
          color: theme.colors.slate[7],
        },
      }),
    },

    InputLabel: {
      defaultProps: {
        fw: 600,
        size: 'sm',
      },
      styles: (theme: MantineTheme) => ({
        root: {
          color: theme.colors.slate[7],
          marginBottom: rem(6),
        },
      }),
    },

    Modal: {
      defaultProps: {
        radius: 'lg',
        centered: true,
        overlayProps: {
          blur: 6,
          opacity: 0.55,
        },
      },
      styles: (theme: MantineTheme) => ({
        header: {
          borderBottom: `1px solid ${theme.colors.slate[2]}`,
          paddingBottom: theme.spacing.md,
        },
        body: {
          paddingTop: theme.spacing.lg,
        },
        title: {
          fontWeight: 700,
          fontSize: rem(20),
        },
      }),
    },

    Alert: {
      defaultProps: {
        radius: 'md',
      },
      styles: () => ({
        root: {
          borderWidth: rem(1),
        },
        title: {
          fontWeight: 600,
          fontSize: rem(14),
        },
        message: {
          fontSize: rem(14),
        },
      }),
    },

    Notification: {
      defaultProps: {
        radius: 'lg',
      },
      styles: (theme: MantineTheme) => ({
        root: {
          borderWidth: rem(1),
          boxShadow: theme.shadows.lg,
        },
        title: {
          fontWeight: 600,
          fontSize: rem(14),
        },
        description: {
          fontSize: rem(14),
        },
      }),
    },

    Loader: {
      defaultProps: {
        type: 'dots',
      },
    },

    Tooltip: {
      defaultProps: {
        radius: 'md',
        withArrow: true,
      },
      styles: () => ({
        tooltip: {
          fontSize: rem(13),
          fontWeight: 500,
          padding: `${rem(6)} ${rem(10)}`,
        },
      }),
    },

    Stepper: {
      styles: (_theme: MantineTheme) => ({
        stepIcon: {
          borderWidth: rem(2),
          fontWeight: 700,
        },
        stepLabel: {
          fontWeight: 600,
          fontSize: rem(14),
        },
        stepDescription: {
          fontSize: rem(13),
        },
        separator: {
          height: rem(2),
        },
      }),
    },

    Paper: {
      defaultProps: {
        radius: 'md',
      },
    },
  },

  focusRing: 'auto',

  defaultGradient: {
    from: 'ocean.5',
    to: 'ocean.7',
    deg: 135,
  },
});
