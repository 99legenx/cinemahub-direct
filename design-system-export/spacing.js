// legendaryMovies Spacing System
// Consistent spacing scale for React Native

export const spacing = {
  // Base spacing unit (4px)
  unit: 4,
  
  // Spacing scale
  xs: 4,    // 0.25rem
  sm: 8,    // 0.5rem
  md: 16,   // 1rem
  lg: 24,   // 1.5rem
  xl: 32,   // 2rem
  '2xl': 48, // 3rem
  '3xl': 64, // 4rem
  '4xl': 80, // 5rem
  '5xl': 96, // 6rem
  
  // Component-specific spacing
  container: {
    padding: 32,        // 2rem
    maxWidth: 1400,     // 2xl breakpoint
  },
  
  card: {
    padding: 24,        // 1.5rem
    margin: 16,         // 1rem
    gap: 16,           // 1rem
  },
  
  button: {
    paddingVertical: 12,    // 0.75rem
    paddingHorizontal: 24,  // 1.5rem
    borderRadius: 12,       // var(--radius)
  },
  
  input: {
    paddingVertical: 12,    // 0.75rem
    paddingHorizontal: 16,  // 1rem
    borderRadius: 8,        // md radius
  },
  
  section: {
    paddingVertical: 64,    // 4rem
    paddingHorizontal: 32,  // 2rem
    marginBottom: 48,       // 3rem
  },
};

// Border radius system
export const borderRadius = {
  none: 0,
  sm: 4,     // calc(var(--radius) - 4px)
  md: 8,     // calc(var(--radius) - 2px)
  lg: 12,    // var(--radius)
  xl: 16,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
};

// Layout helpers
export const layout = {
  // Screen dimensions helpers
  screenPadding: 20,
  headerHeight: 60,
  tabBarHeight: 80,
  
  // Grid system
  grid: {
    columns: 12,
    gutter: 16,
  },
  
  // Breakpoints (for responsive design)
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
  
  // Z-index scale
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
};