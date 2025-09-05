// legendaryMovies Gradient System
// For use with react-native-linear-gradient

export const gradients = {
  // Main hero gradient
  hero: {
    colors: ['#050507', '#0e0e16', '#12141f', '#0a0a0f'],
    locations: [0, 0.3, 0.7, 1],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
    angle: 135,
  },
  
  // Card backgrounds
  card: {
    colors: ['#0c0c13', '#12141f', '#0f0f18'],
    locations: [0, 0.5, 1],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
    angle: 145,
  },
  
  // Gold accent gradient
  gold: {
    colors: ['#f5d547', '#e6b800', '#d4a500'],
    locations: [0, 0.5, 1],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
    angle: 135,
  },
  
  // Red accent gradient
  accent: {
    colors: ['#dc3545', '#c82333', '#b01e2f'],
    locations: [0, 0.5, 1],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
    angle: 135,
  },
  
  // Premium combination
  premium: {
    colors: ['#f5d547', '#dc3545'],
    locations: [0, 1],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
    angle: 135,
  },
  
  // Surface gradient
  surface: {
    colors: ['#070709', '#0f1119'],
    locations: [0, 1],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
    angle: 145,
  },
};

// React Native LinearGradient component helper
export const createGradient = (gradientName) => {
  const gradient = gradients[gradientName];
  
  return {
    colors: gradient.colors,
    locations: gradient.locations,
    start: gradient.start,
    end: gradient.end,
    style: {
      flex: 1,
    }
  };
};

// Usage example:
/*
import LinearGradient from 'react-native-linear-gradient';
import { createGradient } from './gradients';

const heroGradient = createGradient('hero');

<LinearGradient
  colors={heroGradient.colors}
  locations={heroGradient.locations}
  start={heroGradient.start}
  end={heroGradient.end}
  style={[heroGradient.style, additionalStyles]}
>
  {children}
</LinearGradient>
*/