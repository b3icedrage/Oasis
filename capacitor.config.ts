import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.glitchit.app',
  appName: 'GlitchIt',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#07070d',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      spinnerColor: '#00e5ff',
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#07070d',
      overlaysWebView: false,
    },
    Keyboard: {
      resize: 'body',
      style: 'DARK',
      resizeOnFullScreen: true,
    },
    Camera: {
      androidPermissions: ['android.permission.CAMERA'],
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#00e5ff',
    },
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#07070d',
  },
};

export default config;
