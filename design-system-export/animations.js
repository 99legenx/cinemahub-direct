// legendaryMovies Animation System
// For React Native Animated API

export const animations = {
  // Timing functions (for React Native Animated.timing)
  timingFunctions: {
    smooth: {
      duration: 300,
      useNativeDriver: true,
    },
    
    bounce: {
      duration: 400,
      useNativeDriver: true,
    },
    
    glow: {
      duration: 300,
      useNativeDriver: false, // Glow effects often need layout animations
    },
    
    fast: {
      duration: 150,
      useNativeDriver: true,
    },
    
    slow: {
      duration: 600,
      useNativeDriver: true,
    },
  },
  
  // Common easing curves
  easing: {
    // React Native Easing functions
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    linear: 'linear',
    
    // Custom cubic-bezier equivalents for React Native
    smooth: 'ease-out',     // cubic-bezier(0.4, 0, 0.2, 1)
    bounce: 'ease-out',     // cubic-bezier(0.68, -0.55, 0.265, 1.55)
  },
  
  // Pre-configured animations
  presets: {
    // Fade animations
    fadeIn: {
      from: { opacity: 0 },
      to: { opacity: 1 },
      duration: 300,
      useNativeDriver: true,
    },
    
    fadeOut: {
      from: { opacity: 1 },
      to: { opacity: 0 },
      duration: 300,
      useNativeDriver: true,
    },
    
    // Scale animations
    scaleIn: {
      from: { transform: [{ scale: 0.8 }], opacity: 0 },
      to: { transform: [{ scale: 1 }], opacity: 1 },
      duration: 300,
      useNativeDriver: true,
    },
    
    scaleOut: {
      from: { transform: [{ scale: 1 }], opacity: 1 },
      to: { transform: [{ scale: 0.8 }], opacity: 0 },
      duration: 300,
      useNativeDriver: true,
    },
    
    // Slide animations
    slideInUp: {
      from: { transform: [{ translateY: 50 }], opacity: 0 },
      to: { transform: [{ translateY: 0 }], opacity: 1 },
      duration: 300,
      useNativeDriver: true,
    },
    
    slideInDown: {
      from: { transform: [{ translateY: -50 }], opacity: 0 },
      to: { transform: [{ translateY: 0 }], opacity: 1 },
      duration: 300,
      useNativeDriver: true,
    },
    
    slideInLeft: {
      from: { transform: [{ translateX: -50 }], opacity: 0 },
      to: { transform: [{ translateX: 0 }], opacity: 1 },
      duration: 300,
      useNativeDriver: true,
    },
    
    slideInRight: {
      from: { transform: [{ translateX: 50 }], opacity: 0 },
      to: { transform: [{ translateX: 0 }], opacity: 1 },
      duration: 300,
      useNativeDriver: true,
    },
    
    // Bounce effect
    bounce: {
      from: { transform: [{ scale: 1 }] },
      to: { transform: [{ scale: 1.1 }] },
      duration: 200,
      useNativeDriver: true,
    },
    
    // Glow pulse
    glowPulse: {
      from: { opacity: 0.5 },
      to: { opacity: 1 },
      duration: 1000,
      useNativeDriver: false,
    },
  },
  
  // Spring configurations
  springs: {
    gentle: {
      tension: 120,
      friction: 14,
    },
    
    wobbly: {
      tension: 180,
      friction: 12,
    },
    
    stiff: {
      tension: 210,
      friction: 20,
    },
    
    slow: {
      tension: 280,
      friction: 60,
    },
  },
};

// Animation helper functions
export const animationHelpers = {
  // Create a simple fade animation
  createFadeAnimation: (animated, toValue, duration = 300) => {
    return Animated.timing(animated, {
      toValue,
      duration,
      useNativeDriver: true,
    });
  },
  
  // Create a spring animation
  createSpringAnimation: (animated, toValue, config = animations.springs.gentle) => {
    return Animated.spring(animated, {
      toValue,
      ...config,
      useNativeDriver: true,
    });
  },
  
  // Create a sequence of animations
  createSequence: (...animationConfigs) => {
    return Animated.sequence(animationConfigs);
  },
  
  // Create parallel animations
  createParallel: (...animationConfigs) => {
    return Animated.parallel(animationConfigs);
  },
  
  // Create a loop animation
  createLoop: (animation, iterations = -1) => {
    return Animated.loop(animation, { iterations });
  },
};

// Usage example:
/*
import { Animated } from 'react-native';
import { animations, animationHelpers } from './animations';

const fadeAnim = new Animated.Value(0);

// Simple fade in
animationHelpers.createFadeAnimation(fadeAnim, 1, 300).start();

// Using preset
const scaleAnim = new Animated.Value(0.8);
Animated.timing(scaleAnim, {
  ...animations.presets.scaleIn,
  toValue: 1,
}).start();
*/