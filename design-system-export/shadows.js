// legendaryMovies Shadow System
// React Native shadow properties

export const shadows = {
  // Glowing gold effect
  glow: {
    shadowColor: '#f5d547',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 40,
    elevation: 8,
  },
  
  // Red glow effect
  glowRed: {
    shadowColor: '#dc3545',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 6,
  },
  
  // Standard card shadow
  card: {
    shadowColor: '#050507',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 15,
  },
  
  // Intense shadow
  intense: {
    shadowColor: '#050507',
    shadowOffset: {
      width: 0,
      height: 25,
    },
    shadowOpacity: 0.9,
    shadowRadius: 50,
    elevation: 25,
  },
  
  // Button shadow
  button: {
    shadowColor: '#f5d547',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  
  // Surface shadow
  surface: {
    shadowColor: '#050507',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.6,
    shadowRadius: 25,
    elevation: 12,
  },
  
  // No shadow
  none: {
    shadowColor: 'transparent',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
};

// Shadow helper functions
export const shadowHelpers = {
  // Create custom shadow with color and intensity
  createShadow: (color, intensity = 'medium') => {
    const intensityMap = {
      light: { radius: 10, opacity: 0.3, elevation: 5 },
      medium: { radius: 20, opacity: 0.5, elevation: 10 },
      heavy: { radius: 40, opacity: 0.8, elevation: 20 },
    };
    
    const config = intensityMap[intensity];
    
    return {
      shadowColor: color,
      shadowOffset: {
        width: 0,
        height: config.radius / 2,
      },
      shadowOpacity: config.opacity,
      shadowRadius: config.radius,
      elevation: config.elevation,
    };
  },
  
  // Combine multiple shadows (for complex effects)
  combineShadows: (...shadowObjects) => {
    // Note: React Native doesn't support multiple shadows like CSS
    // This returns the most prominent shadow
    return shadowObjects.reduce((acc, shadow) => {
      return shadow.elevation > (acc.elevation || 0) ? shadow : acc;
    }, {});
  },
};