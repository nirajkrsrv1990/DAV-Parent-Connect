import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dav.parentconnect',
  appName: 'DPC',
  webDir: 'dist',
  server: {
    url: 'http://200.141.0.100',
    cleartext: true
  }
};

export default config;