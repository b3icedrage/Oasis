import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

export interface CapturedPhoto {
  webPath: string;
  base64String?: string;
  format: string;
}

export async function capturePhoto(): Promise<CapturedPhoto | null> {
  if (!Capacitor.isNativePlatform()) {
    // Web fallback: use file input
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      input.onchange = () => {
        const file = input.files?.[0];
        if (!file) return resolve(null);
        const webPath = URL.createObjectURL(file);
        resolve({ webPath, format: 'jpeg' });
      };
      input.click();
    });
  }

  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
      width: 1080,
      height: 1080,
    });

    return {
      webPath: image.webPath || '',
      format: image.format || 'jpeg',
    };
  } catch {
    return null;
  }
}

export async function captureFromGallery(): Promise<CapturedPhoto | null> {
  if (!Capacitor.isNativePlatform()) {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = () => {
        const file = input.files?.[0];
        if (!file) return resolve(null);
        const webPath = URL.createObjectURL(file);
        resolve({ webPath, format: 'jpeg' });
      };
      input.click();
    });
  }

  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
      width: 1080,
      height: 1080,
    });

    return {
      webPath: image.webPath || '',
      format: image.format || 'jpeg',
    };
  } catch {
    return null;
  }
}
