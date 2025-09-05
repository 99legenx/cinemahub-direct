# legendaryMovies Design System Export

This folder contains the design system tokens and documentation for migrating to React Native.

## Files Overview

- `colors.js` - All color tokens in HSL format with React Native conversion
- `shadows.js` - Shadow definitions and React Native equivalents  
- `gradients.js` - Gradient definitions for React Native
- `typography.js` - Font and text styling guidelines
- `spacing.js` - Spacing and layout tokens
- `animations.js` - Animation timing functions and durations
- `theme.js` - Complete theme object for React Native

## Usage

1. Install React Native design system libraries:
   ```bash
   npm install react-native-linear-gradient react-native-svg
   ```

2. Import theme tokens:
   ```javascript
   import { theme } from './design-system-export/theme';
   import { colors } from './design-system-export/colors';
   ```

3. Use in React Native components:
   ```jsx
   <View style={{
     backgroundColor: colors.background,
     shadowColor: theme.shadows.card.shadowColor,
     shadowOffset: theme.shadows.card.shadowOffset,
   }}>
   ```

## Cinema Theme Philosophy

The design system follows a cinema-inspired dark theme with:
- **Primary Gold**: #f5d547 (Cinema marquee lights)
- **Accent Red**: #dc3545 (Cinema seats/curtains)  
- **Dark Backgrounds**: Deep blues and blacks
- **Premium Gradients**: Gold and red combinations
- **Glowing Effects**: Subtle light emanation

## Migration Notes

- HSL colors are converted to RGB for React Native
- Box shadows become elevation + shadow properties
- CSS gradients use react-native-linear-gradient
- Border radius uses consistent 12px base
- Animations use React Native's Animated API