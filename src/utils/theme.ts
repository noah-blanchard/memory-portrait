import { MantineTheme } from '@mantine/core';

/**
 * Generate a CSS gradient string from theme gradient definition
 */
export function getGradient(theme: MantineTheme, gradientName: keyof typeof theme.gradients): string {
  const gradient = theme.gradients[gradientName];
  if (!gradient) {
    throw new Error(`Gradient '${gradientName}' not found in theme`);
  }

  const fromColor = getColorValue(theme, gradient.from);
  const toColor = getColorValue(theme, gradient.to);
  
  return `linear-gradient(${gradient.deg}deg, ${fromColor} 0%, ${toColor} 100%)`;
}

/**
 * Get color value from theme color string (e.g., 'rose.6' -> actual color value)
 */
export function getColorValue(theme: MantineTheme, colorString: string): string {
  const [colorName, shade] = colorString.split('.');
  const colorIndex = parseInt(shade);
  
  if (!theme.colors[colorName] || !theme.colors[colorName][colorIndex]) {
    throw new Error(`Color '${colorString}' not found in theme`);
  }
  
  return theme.colors[colorName][colorIndex];
}

/**
 * Get color with opacity
 */
export function getColorWithOpacity(theme: MantineTheme, colorString: string, opacity: number): string {
  const color = getColorValue(theme, colorString);
  const opacityHex = Math.round(opacity * 255).toString(16).padStart(2, '0');
  return `${color}${opacityHex}`;
}

/**
 * Get shadow with theme color
 */
export function getShadow(theme: MantineTheme, colorString: string, opacity: number = 0.3): string {
  const color = getColorWithOpacity(theme, colorString, opacity);
  return `0 4px 16px ${color}`;
}

/**
 * Get hover shadow with theme color
 */
export function getHoverShadow(theme: MantineTheme, colorString: string, opacity: number = 0.4): string {
  const color = getColorWithOpacity(theme, colorString, opacity);
  return `0 8px 24px ${color}`;
}
