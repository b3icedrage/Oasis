import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'
import { SplashScreen } from '@capacitor/splash-screen'
import './index.css'
import App from './App'

// Initialize Capacitor native plugins
async function initCapacitor() {
  if (Capacitor.isNativePlatform()) {
    // Set status bar style
    await StatusBar.setStyle({ style: Style.Dark })
    await StatusBar.setBackgroundColor({ color: '#07070d' })

    // Hide splash screen after app is ready
    await SplashScreen.hide()
  }
}

// Add safe area CSS variable for notch devices
function setSafeAreaInsets() {
  const root = document.documentElement
  const safeAreaTop = getComputedStyle(root).getPropertyValue('env(safe-area-inset-top)') || '0px'
  const safeAreaBottom = getComputedStyle(root).getPropertyValue('env(safe-area-inset-bottom)') || '0px'
  root.style.setProperty('--safe-area-top', safeAreaTop)
  root.style.setProperty('--safe-area-bottom', safeAreaBottom)
}

// Wait for DOM ready
document.addEventListener('DOMContentLoaded', () => {
  setSafeAreaInsets()
})

// Wait for Capacitor bridge ready
document.addEventListener('capacitorReady', () => {
  initCapacitor()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
