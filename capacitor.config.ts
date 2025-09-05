import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.3fb275aab3b04871ba0f44769fa7bf50',
  appName: 'legendaryMovies',
  webDir: 'dist',
  server: {
    url: 'https://3fb275aa-b3b0-4871-ba0f-44769fa7bf50.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#000000',
      showSpinner: false
    }
  }
};

export default config;