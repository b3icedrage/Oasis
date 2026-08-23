import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'
import { SplashScreen } from '@capacitor/splash-screen'
import { requestNotificationPermission } from './hooks/useNotifications'
import './index.css'
import App from './App'

// Initialize Capacitor native plugins
async function initCapacitor() {
  if (Capacitor.isNativePlatform()) {
    await StatusBar.setStyle({ style: Style.Dark })
    await StatusBar.setBackgroundColor({ color: '#07070d' })
    await SplashScreen.hide()

    // Request notification permission after a short delay
    setTimeout(() => {
      requestNotificationPermission()
    }, 3000)
  }
}

// Add safe area CSS variable
function setSafeAreaInsets() {
  const root = document.documentElement
  root.style.setProperty('--safe-area-top', 'env(safe-area-inset-top, 0px)')
  root.style.setProperty('--safe-area-bottom', 'env(safe-area-inset-bottom, 0px)')
}

document.addEventListener('DOMContentLoaded', () => {
  setSafeAreaInsets()
})

document.addEventListener('capacitorReady', () => {
  initCapacitor()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
