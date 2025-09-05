// legendaryMovies Complete Theme Object
// Centralized theme for React Native

import { colors } from './colors';
import { gradients } from './gradients';
import { shadows } from './shadows';
import { spacing, borderRadius, layout } from './spacing';
import { typography, textStyles } from './typography';
import { animations } from './animations';

export const theme = {
  // Color system
  colors,
  
  // Gradients
  gradients,
  
  // Shadows and elevation
  shadows,
  
  // Spacing and layout
  spacing,
  borderRadius,
  layout,
  
  // Typography
  typography,
  textStyles,
  
  // Animations
  animations,
  
  // Component themes
  components: {
    // Button variants
    button: {
      primary: {
        backgroundColor: colors.primary,
        color: colors.primaryForeground,
        borderRadius: borderRadius.lg,
        paddingVertical: spacing.button.paddingVertical,
        paddingHorizontal: spacing.button.paddingHorizontal,
        ...shadows.button,
        ...textStyles.button,
      },
      
      secondary: {
        backgroundColor: colors.secondary,
        color: colors.secondaryForeground,
        borderRadius: borderRadius.lg,
        paddingVertical: spacing.button.paddingVertical,
        paddingHorizontal: spacing.button.paddingHorizontal,
        ...shadows.card,
        ...textStyles.button,
      },
      
      outline: {
        backgroundColor: 'transparent',
        color: colors.primary,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: borderRadius.lg,
        paddingVertical: spacing.button.paddingVertical,
        paddingHorizontal: spacing.button.paddingHorizontal,
        ...textStyles.button,
      },
      
      ghost: {
        backgroundColor: 'transparent',
        color: colors.foreground,
        borderRadius: borderRadius.lg,
        paddingVertical: spacing.button.paddingVertical,
        paddingHorizontal: spacing.button.paddingHorizontal,
        ...textStyles.button,
      },
    },
    
    // Card variants
    card: {
      default: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        padding: spacing.card.padding,
        ...shadows.card,
      },
      
      elevated: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        padding: spacing.card.padding,
        ...shadows.intense,
      },
      
      outline: {
        backgroundColor: 'transparent',
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: borderRadius.lg,
        padding: spacing.card.padding,
      },
    },
    
    // Input variants
    input: {
      default: {
        backgroundColor: colors.input,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.input.paddingVertical,
        paddingHorizontal: spacing.input.paddingHorizontal,
        color: colors.foreground,
        fontSize: textStyles.body.fontSize,
      },
      
      focused: {
        borderColor: colors.ring,
        borderWidth: 2,
        ...shadows.glow,
      },
      
      error: {
        borderColor: colors.destructive,
        borderWidth: 1,
      },
    },
    
    // Badge variants
    badge: {
      default: {
        backgroundColor: colors.primary,
        color: colors.primaryForeground,
        borderRadius: borderRadius.sm,
        paddingVertical: 4,
        paddingHorizontal: 8,
        ...textStyles.badge,
      },
      
      secondary: {
        backgroundColor: colors.secondary,
        color: colors.secondaryForeground,
        borderRadius: borderRadius.sm,
        paddingVertical: 4,
        paddingHorizontal: 8,
        ...textStyles.badge,
      },
      
      outline: {
        backgroundColor: 'transparent',
        color: colors.foreground,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: borderRadius.sm,
        paddingVertical: 4,
        paddingHorizontal: 8,
        ...textStyles.badge,
      },
    },
  },
  
  // Cinema-specific components
  cinema: {
    movieCard: {
      backgroundColor: colors.card,
      borderRadius: borderRadius.lg,
      ...shadows.card,
      overflow: 'hidden',
    },
    
    movieTitle: {
      ...textStyles.movieTitle,
    },
    
    movieGenre: {
      ...textStyles.movieGenre,
    },
    
    heroSection: {
      minHeight: 400,
      padding: spacing.section.paddingHorizontal,
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    glowEffect: {
      ...shadows.glow,
    },
    
    premiumGradient: {
      ...gradients.premium,
    },
  },
  
  // Responsive breakpoints helper
  responsive: {
    isSmallScreen: (width) => width < layout.breakpoints.md,
    isMediumScreen: (width) => width >= layout.breakpoints.md && width < layout.breakpoints.lg,
    isLargeScreen: (width) => width >= layout.breakpoints.lg,
  },
  
  // Dark mode toggle
  dark: {
    colors: colors.dark,
    // Override other theme values for dark mode if needed
  },
};

// Theme helper functions
export const themeHelpers = {
  // Get responsive value
  getResponsiveValue: (values, screenWidth) => {
    if (screenWidth < layout.breakpoints.md) return values.sm || values.base;
    if (screenWidth < layout.breakpoints.lg) return values.md || values.base;
    return values.lg || values.base;
  },
  
  // Create component style with theme
  createComponentStyle: (componentName, variant = 'default') => {
    return theme.components[componentName]?.[variant] || {};
  },
  
  // Merge theme colors with custom styles
  mergeStyles: (themeStyle, customStyle) => {
    return { ...themeStyle, ...customStyle };
  },
};

export default theme;