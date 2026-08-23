import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

const isNative = Capacitor.isNativePlatform();

export async function hapticImpact(style: ImpactStyle = ImpactStyle.Light) {
  if (!isNative) return;
  try {
    await Haptics.impact({ style });
  } catch {}
}

export async function hapticNotification(type: NotificationType = NotificationType.Success) {
  if (!isNative) return;
  try {
    await Haptics.notification({ type });
  } catch {}
}

export async function hapticVibrate() {
  if (!isNative) return;
  try {
    await Haptics.vibrate();
  } catch {}
}

// Web fallback vibrations for preview mode
export function webVibrate(pattern?: number[]) {
  if (navigator.vibrate) {
    navigator.vibrate(pattern || [10]);
  }
}
