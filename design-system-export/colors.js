// legendaryMovies Color System
// HSL values converted to RGB for React Native compatibility

export const colors = {
  // Core theme colors
  background: '#0a0a0f',        // hsl(222 84% 3%)
  foreground: '#fafafa',        // hsl(0 0% 98%)
  
  card: '#0e0e16',              // hsl(222 84% 5%)
  cardForeground: '#fafafa',    // hsl(0 0% 98%)
  
  popover: '#0c0c13',           // hsl(222 84% 4%)
  popoverForeground: '#fafafa', // hsl(0 0% 98%)
  
  primary: '#f5d547',           // hsl(45 100% 62%) - Cinema Gold
  primaryForeground: '#0b0b12', // hsl(222 84% 4.9%)
  
  secondary: '#1e2438',         // hsl(217 32% 17%)
  secondaryForeground: '#fafafa', // hsl(0 0% 98%)
  
  muted: '#151826',             // hsl(217 32% 12%)
  mutedForeground: '#94a3b8',   // hsl(215 20% 65%)
  
  accent: '#dc3545',            // hsl(0 85% 55%) - Cinema Red
  accentForeground: '#fafafa',  // hsl(0 0% 98%)
  
  destructive: '#e53e3e',       // hsl(0 84% 60%)
  destructiveForeground: '#fafafa', // hsl(0 0% 98%)
  
  border: '#1a1f2e',           // hsl(217 32% 15%)
  input: '#1a1f2e',            // hsl(217 32% 15%)
  ring: '#f5d547',             // hsl(45 100% 62%)
  
  // Cinema-specific colors
  cinema: {
    gold: '#f5d547',           // hsl(45 100% 62%)
    red: '#dc3545',            // hsl(0 85% 55%)
    dark: '#0a0a0f',           // hsl(222 84% 3%)
    darker: '#050507',         // hsl(222 84% 1%)
    light: '#fafafa',          // hsl(0 0% 98%)
  },
  
  // Dark mode variants
  dark: {
    background: '#070709',       // hsl(222 84% 2%)
    card: '#0c0c13',            // hsl(222 84% 4%)
    popover: '#0a0a0f',         // hsl(222 84% 3%)
    primary: '#f8dd5a',         // hsl(45 100% 65%)
    secondary: '#1f2640',       // hsl(217 32% 15%)
    muted: '#12141f',           // hsl(217 32% 10%)
    mutedForeground: '#a1a9ba', // hsl(215 20% 70%)
    accent: '#e94560',          // hsl(0 85% 58%)
    destructive: '#dc2626',     // hsl(0 84% 55%)
    border: '#151826',          // hsl(217 32% 12%)
    input: '#151826',           // hsl(217 32% 12%)
    ring: '#f8dd5a',            // hsl(45 100% 65%)
  }
};

// React Native color helpers
export const colorHelpers = {
  // Convert HSL to RGB for React Native
  hslToRgb: (h, s, l) => {
    const a = s * Math.min(l, 1 - l);
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color);
    };
    return `rgb(${f(0)}, ${f(8)}, ${f(4)})`;
  },
  
  // Add alpha to color
  addAlpha: (color, alpha) => {
    return color.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
  }
};