let Haptics: any = null;
try {
  Haptics = require("expo-haptics");
} catch (e) {
  // expo-haptics not available — no-op
}

export function lightImpact() {
  try {
    if (Haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {}
}

export function mediumImpact() {
  try {
    if (Haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch {}
}

export function heavyImpact() {
  try {
    if (Haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  } catch {}
}

export function successNotification() {
  try {
    if (Haptics) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {}
}

export function warningNotification() {
  try {
    if (Haptics) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  } catch {}
}

export function errorNotification() {
  try {
    if (Haptics) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch {}
}
