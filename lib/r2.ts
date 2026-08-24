/**
 * Cloudflare R2 Upload Client
 *
 * Lightweight upload utility that talks to the presign Worker
 * to get a signed URL, then uploads directly to R2.
 *
 * Environment variables (in your Expo .env or app config):
 *   EXPO_PUBLIC_R2_PRESIGN_URL — URL of your deployed Cloudflare Worker
 *                                e.g. https://r2-presign.yourname.workers.dev/presign
 *
 * No heavy AWS SDK needed on the client — just fetch.
 */

const PRESIGN_URL = process.env.EXPO_PUBLIC_R2_PRESIGN_URL || "";

export interface UploadResult {
  publicUrl: string;
  key: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percent: number;
}

/**
 * Upload a file (image or video) to Cloudflare R2.
 * Returns the public CDN URL of the uploaded file.
 */
export async function uploadToR2(
  uri: string,
  contentType: string,
  type: "image" | "video" = "image",
  onProgress?: (progress: UploadProgress) => void,
): Promise<UploadResult> {
  if (!PRESIGN_URL) {
    throw new Error(
      "R2 presign URL not configured. Set EXPO_PUBLIC_R2_PRESIGN_URL in your .env",
    );
  }

  // Step 1: Get a presigned upload URL from the Worker
  const presignRes = await fetch(PRESIGN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contentType, type }),
  });

  if (!presignRes.ok) {
    throw new Error(`Failed to get upload URL: ${presignRes.status}`);
  }

  const { uploadUrl, publicUrl, key } = await presignRes.json();

  // Step 2: Read the file from the local URI
  // In React Native, we use fetch to read the file as a blob
  const fileRes = await fetch(uri);
  if (!fileRes.ok) {
    throw new Error("Failed to read file from device");
  }

  const blob = await fileRes.blob();
  const totalSize = blob.size;

  // Step 3: Upload directly to R2 using the presigned URL
  // Use XMLHttpRequest for progress tracking in React Native
  return new Promise<UploadResult>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (onProgress && event.lengthComputable) {
        onProgress({
          loaded: event.loaded,
          total: event.total,
          percent: Math.round((event.loaded / event.total) * 100),
        });
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({ publicUrl, key });
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error("Upload failed — network error"));
    xhr.ontimeout = () => reject(new Error("Upload failed — timeout"));

    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.send(blob);
  });
}

/**
 * Upload a video to R2.
 * Convenience wrapper around uploadToR2 with video defaults.
 */
export async function uploadVideo(
  uri: string,
  onProgress?: (progress: UploadProgress) => void,
): Promise<UploadResult> {
  return uploadToR2(uri, "video/mp4", "video", onProgress);
}

/**
 * Upload an image to R2.
 * Convenience wrapper around uploadToR2 with image defaults.
 */
export async function uploadImage(
  uri: string,
  onProgress?: (progress: UploadProgress) => void,
): Promise<UploadResult> {
  return uploadToR2(uri, "image/jpeg", "image", onProgress);
}
