// legendaryMovies Typography System
// Font styling for React Native

export const typography = {
  // Font families
  fonts: {
    // React Native default fonts
    default: 'System',
    ios: 'San Francisco',
    android: 'Roboto',
    
    // Custom fonts (add to React Native project)
    heading: 'System', // Replace with custom font
    body: 'System',    // Replace with custom font
    mono: 'Menlo',     // Monospace font
  },
  
  // Font sizes
  fontSizes: {
    xs: 12,    // 0.75rem
    sm: 14,    // 0.875rem
    base: 16,  // 1rem
    lg: 18,    // 1.125rem
    xl: 20,    // 1.25rem
    '2xl': 24, // 1.5rem
    '3xl': 30, // 1.875rem
    '4xl': 36, // 2.25rem
    '5xl': 48, // 3rem
    '6xl': 60, // 3.75rem
    '7xl': 72, // 4.5rem
    '8xl': 96, // 6rem
    '9xl': 128, // 8rem
  },
  
  // Font weights
  fontWeights: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  
  // Line heights
  lineHeights: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  
  // Letter spacing
  letterSpacing: {
    tighter: -0.8,
    tight: -0.4,
    normal: 0,
    wide: 0.4,
    wider: 0.8,
    widest: 1.6,
  },
};

// Pre-defined text styles
export const textStyles = {
  // Headings
  h1: {
    fontSize: typography.fontSizes['4xl'],
    fontWeight: typography.fontWeights.bold,
    lineHeight: typography.lineHeights.tight,
    letterSpacing: typography.letterSpacing.tight,
    color: '#fafafa', // foreground
  },
  
  h2: {
    fontSize: typography.fontSizes['3xl'],
    fontWeight: typography.fontWeights.bold,
    lineHeight: typography.lineHeights.tight,
    letterSpacing: typography.letterSpacing.tight,
    color: '#fafafa',
  },
  
  h3: {
    fontSize: typography.fontSizes['2xl'],
    fontWeight: typography.fontWeights.semibold,
    lineHeight: typography.lineHeights.snug,
    color: '#fafafa',
  },
  
  h4: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.semibold,
    lineHeight: typography.lineHeights.snug,
    color: '#fafafa',
  },
  
  // Body text
  body: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.normal,
    lineHeight: typography.lineHeights.normal,
    color: '#fafafa',
  },
  
  bodySmall: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    lineHeight: typography.lineHeights.normal,
    color: '#94a3b8', // muted-foreground
  },
  
  // Special text styles
  caption: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.medium,
    lineHeight: typography.lineHeights.normal,
    color: '#94a3b8',
  },
  
  button: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    lineHeight: typography.lineHeights.none,
    letterSpacing: typography.letterSpacing.wide,
  },
  
  badge: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.semibold,
    lineHeight: typography.lineHeights.none,
    letterSpacing: typography.letterSpacing.wide,
    textTransform: 'uppercase',
  },
  
  // Cinema-specific styles
  movieTitle: {
    fontSize: typography.fontSizes['2xl'],
    fontWeight: typography.fontWeights.bold,
    lineHeight: typography.lineHeights.tight,
    color: '#f5d547', // cinema gold
  },
  
  movieGenre: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    lineHeight: typography.lineHeights.normal,
    color: '#dc3545', // cinema red
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wider,
  },
  
  hero: {
    fontSize: typography.fontSizes['6xl'],
    fontWeight: typography.fontWeights.black,
    lineHeight: typography.lineHeights.none,
    letterSpacing: typography.letterSpacing.tighter,
    color: '#fafafa',
  },
};